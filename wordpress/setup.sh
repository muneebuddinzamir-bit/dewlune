#!/usr/bin/env bash
# Starts the local WordPress + WooCommerce backend and seeds the Dewlune catalog.
# Run it again any time: every step skips work that is already done.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  printf 'DB_PASSWORD=%s\nWP_ADMIN_PASSWORD=%s\n' "$(openssl rand -hex 16)" "$(openssl rand -hex 12)" > .env
  echo "Created wordpress/.env with fresh passwords (the WordPress admin password is in there)."
fi
set -a
# shellcheck disable=SC1091
source .env
set +a

wp() { docker compose run --rm -T cli wp "$@"; }

echo "Starting containers..."
docker compose up -d db wordpress

echo "Waiting for WordPress files..."
for _ in $(seq 1 60); do
  if wp core version >/dev/null 2>&1; then break; fi
  sleep 2
done

if ! wp core is-installed >/dev/null 2>&1; then
  echo "Installing WordPress..."
  wp core install \
    --url="http://localhost:8080" \
    --title="Dewlune" \
    --admin_user=admin \
    --admin_password="$WP_ADMIN_PASSWORD" \
    --admin_email=admin@example.test \
    --skip-email
fi

# WooCommerce tracks the newest WordPress; keep core current (also upgrades an older volume).
wp core update >/dev/null
wp core update-db >/dev/null

# The official image ships an .htaccess with the rewrite rules, so no --hard flush is needed.
wp rewrite structure '/%postname%/' >/dev/null

if ! wp plugin is-installed woocommerce >/dev/null 2>&1; then
  echo "Installing WooCommerce..."
  wp plugin install woocommerce
fi
wp plugin activate woocommerce >/dev/null

echo "Seeding the catalog..."
wp eval-file /seed/seed.php

echo
echo "WooCommerce is ready at http://localhost:8080 (admin: http://localhost:8080/wp-admin, user 'admin')."
echo "Point the storefront at it with web/.env.local:"
echo "  WC_STORE_URL=http://localhost:8080"
echo "  NEXT_PUBLIC_COMMERCE_MODE=woocommerce"
