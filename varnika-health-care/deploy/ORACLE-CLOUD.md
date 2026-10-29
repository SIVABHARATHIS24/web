# Publishing the website on Oracle Cloud

This guide puts the site on an **Oracle Cloud Always Free** virtual machine, with your own domain and free HTTPS (the padlock in the browser). The VM and the HTTPS certificate cost nothing. You pay only for the domain, usually a few hundred rupees a year.

## 1. Buy a domain

Buy a domain from any registrar (GoDaddy, Hostinger, Namecheap, BigRock and others). Short and easy to say works best, for example:

- `varnikahealthcare.in`
- `varnikaortho.in`
- `varnikaorthoclinic.com`

`.in` domains are usually the cheapest and suit a local clinic.

## 2. Create the VM in Oracle Cloud

1. Sign in to the Oracle Cloud console and go to **Compute → Instances → Create instance**.
2. **Image:** Canonical Ubuntu 22.04 or 24.04.
3. **Shape:** choose an *Always Free–eligible* shape (VM.Standard.E2.1.Micro or Ampere A1).
4. **Networking:** keep "Assign a public IPv4 address" switched on.
5. **SSH keys:** download the private key. You need it to log in.
6. Click **Create**. When the VM is running, note its **Public IP address**.

## 3. Open ports 80 and 443 in Oracle's network

1. On the instance page, click the **Subnet**, then the **Security List**.
2. Click **Add Ingress Rules** and add two rules:
   - Source CIDR `0.0.0.0/0`, IP protocol TCP, destination port **80**
   - Source CIDR `0.0.0.0/0`, IP protocol TCP, destination port **443**

## 4. Point your domain to the VM

In your domain registrar's **DNS settings**, add two **A records**:

| Type | Name / Host | Value |
| --- | --- | --- |
| A | `@` | your VM's public IP |
| A | `www` | your VM's public IP |

DNS changes usually take a few minutes, but can take up to a few hours.

## 5. Put the site on the VM

Log in to the VM (replace the key path and IP):

```bash
ssh -i path/to/private-key ubuntu@YOUR_VM_IP
```

Then, on the VM:

```bash
sudo apt-get update && sudo apt-get install -y git
git clone https://github.com/SIVABHARATHIS24/web.git
cd web/varnika-health-care
sudo bash deploy/setup-server.sh varnikahealthcare.in your-email@example.com
```

Use your real domain and email. Let's Encrypt sends certificate-expiry warnings to that email. The script:
- installs nginx
- copies the website files
- opens the VM's firewall
- gets the HTTPS certificate, which renews automatically

When it finishes, open `https://your-domain` in a browser.

> If the repository is private, `git clone` asks you to sign in. Alternatively, copy the folder from your computer with
> `scp -r -i path/to/private-key varnika-health-care ubuntu@YOUR_VM_IP:~/`

## Updating the site later

After changing the website (a new phone number, the doctor photo and so on):

```bash
ssh -i path/to/private-key ubuntu@YOUR_VM_IP
cd web && git pull
cd varnika-health-care && sudo bash deploy/setup-server.sh varnikahealthcare.in your-email@example.com
```

## Troubleshooting

- **The site doesn't load:** check the two ingress rules from step 3, and that DNS points to the right IP (`ping your-domain` shows the IP).
- **The certificate step fails:** usually DNS hasn't updated yet. Wait a while and run the script again.
