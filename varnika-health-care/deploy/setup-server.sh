#!/usr/bin/env bash
# Sets up an Oracle Cloud Ubuntu VM to serve the Varnika Healthcare website
# with nginx and a free HTTPS certificate from Let's Encrypt.
#
# Run it on the VM, from inside the varnika-health-care folder:
#   sudo bash deploy/setup-server.sh yourdomain.in you@example.com
#
# Before running: point your domain's DNS "A" records (yourdomain.in and
# www.yourdomain.in) to the VM's public IP, and open ports 80 and 443 in the
# VCN security list. See deploy/ORACLE-CLOUD.md.
#
# To update the website later, run the same command again.
set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"
if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Usage: sudo bash deploy/setup-server.sh yourdomain.in you@example.com" >&2
  exit 1
fi
if [[ $EUID -ne 0 ]]; then
  echo "Please run with sudo." >&2
  exit 1
fi
SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [[ ! -f "$SITE_DIR/index.html" ]]; then
  echo "Could not find index.html in $SITE_DIR" >&2
  exit 1
fi

echo "==> Installing nginx and certbot"
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y nginx certbot python3-certbot-nginx rsync iptables-persistent

echo "==> Copying website files to /var/www/varnika"
mkdir -p /var/www/varnika
rsync -a --delete --exclude deploy --exclude README.md --exclude .git "$SITE_DIR/" /var/www/varnika/
chown -R www-data:www-data /var/www/varnika

echo "==> Configuring nginx for $DOMAIN"
# Leave the config alone after the first run, so certbot's HTTPS settings are kept.
if [[ ! -f /etc/nginx/sites-available/varnika ]]; then
  sed "s/DOMAIN/$DOMAIN/g" "$SITE_DIR/deploy/nginx.conf" > /etc/nginx/sites-available/varnika
fi
ln -sf /etc/nginx/sites-available/varnika /etc/nginx/sites-enabled/varnika
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable --now nginx
systemctl reload nginx

echo "==> Opening ports 80 and 443 in the VM firewall"
# Oracle's Ubuntu images block everything except SSH by default.
for port in 80 443; do
  if ! iptables -C INPUT -p tcp --dport "$port" -m state --state NEW -j ACCEPT 2>/dev/null; then
    iptables -I INPUT -p tcp --dport "$port" -m state --state NEW -j ACCEPT
  fi
done
netfilter-persistent save

echo "==> Getting a free HTTPS certificate"
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" -m "$EMAIL" --agree-tos --non-interactive --redirect --keep-until-expiring

echo
echo "Done. Your site is live at https://$DOMAIN"
