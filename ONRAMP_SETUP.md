# Coinbase Onramp Setup Guide

Bu dokümantasyon, Coinbase Onramp entegrasyonunun nasıl yapılandırılacağını açıklar.

## Ön Gereksinimler

1. **Coinbase Developer Platform Hesabı**
   - [Coinbase Developer Portal](https://portal.cdp.coinbase.com/) üzerinden hesap oluşturun
   - Onramp & Offramp erişimi için başvurun (Payments > Onramp & Offramp > Apply)

2. **API Key Oluşturma**
   - Coinbase Developer Portal'da API Keys bölümünden yeni bir API Key oluşturun
   - API Key Name ve Private Key'i güvenli bir yerde saklayın

## Vercel Environment Variables

Vercel'de aşağıdaki environment variable'ları eklemeniz gerekiyor:

1. **Vercel Dashboard'a gidin**: https://vercel.com/dashboard
2. **Projenizi seçin**
3. **Settings > Environment Variables** bölümüne gidin
4. Aşağıdaki variable'ları ekleyin:

### COINBASE_API_KEY_NAME
- **Format**: `organizations/{org_id}/apiKeys/{key_id}`
- Örnek: `organizations/12345678-1234-1234-1234-123456789abc/apiKeys/87654321-4321-4321-4321-cba987654321`
- Coinbase Developer Portal'dan API Key'inizi oluşturduğunuzda bu format size verilir

### COINBASE_API_KEY_PRIVATE_KEY
- **Format**: PEM formatında EC Private Key
- Örnek:
  ```
  -----BEGIN EC PRIVATE KEY-----
  MHcCAQEEIA... (key içeriği)
  -----END EC PRIVATE KEY-----
  ```
- **Önemli**: Private key'i environment variable'a eklerken, newline karakterlerini (`\n`) koruyun
- Vercel'de multi-line string olarak ekleyebilirsiniz

## Local Development

Local development için `.env.local` dosyası oluşturun:

```env
COINBASE_API_KEY_NAME=organizations/{org_id}/apiKeys/{key_id}
COINBASE_API_KEY_PRIVATE_KEY="-----BEGIN EC PRIVATE KEY-----\n...\n-----END EC PRIVATE KEY-----\n"
```

**Not**: `.env.local` dosyası git'e commit edilmemelidir (zaten `.gitignore`'da olmalı).

## Test Etme

1. Vercel'de environment variable'ları ekledikten sonra projeyi yeniden deploy edin
2. Siteyi açın ve wallet'ınızı bağlayın
3. Header'daki "Kartla Al (USDC)" butonuna tıklayın
4. Coinbase Onramp sayfası açılmalı

## Hata Ayıklama

### "Server configuration error: Coinbase API credentials not configured"
- Environment variable'ların Vercel'de doğru şekilde ayarlandığından emin olun
- Vercel'de projeyi yeniden deploy edin (environment variable değişiklikleri için gerekli)

### "Coinbase API error: 401"
- API Key'in doğru olduğundan emin olun
- API Key'in Onramp & Offramp için yetkilendirildiğinden emin olun
- Private key formatının doğru olduğundan emin olun (PEM format, newline karakterleri ile)

### "Coinbase API error: 403"
- Onramp & Offramp erişimi için başvurunuzun onaylandığından emin olun
- API Key'in gerekli izinlere sahip olduğundan emin olun

## Daha Fazla Bilgi

- [Coinbase Onramp Dokümantasyonu](https://docs.cdp.coinbase.com/onramp-&-offramp/introduction/welcome)
- [Session Token Authentication](https://docs.cdp.coinbase.com/onramp-&-offramp/session-token-authentication)
- [API Reference](https://docs.cdp.coinbase.com/api-reference/rest-api/onramp-offramp/create-session-token)

