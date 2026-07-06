# Webhook Integration — Papan Gerak

> Panduan integrasi alert Papan Gerak dengan layanan eksekusi otomatis
> seperti TradersPost, Pine Connector, atau webhook kustom Anda.
>
> **⚠️ DISCLAIMER:**
> Pasar modal Indonesia (IDX) termasuk **thin market** — likuiditas terbatas,
> spread lebar, eksekusi tidak selalu di harga yang diinginkan.
> Webhook trading mengandung risiko signifikan.
> Selalu uji coba di akun demo / paper trading terlebih dahulu.
> Penulis tidak bertanggung jawab atas kerugian akibat penggunaan skrip ini.

---

## 1. Alert Format

Papan Gerak mendukung dua format alert, dipilih via input **Alert Format**
di grup *Webhook*.

### 1.1 Simple (Default)

Format teks biasa, cocok untuk notifikasi manual:

```
PAPAN GERAK (Composite Score): Neutral→Bullish → BULLISH
PAPAN GERAK: Trend ekstrem (85)
PAPAN GERAK: RSI oversold (28)
PAPAN GERAK: Volume spike (250% of MA)
```

### 1.2 JSON (Webhook)

Format pipeline terstruktur, dirancang untuk parsing otomatis.
Setiap alert diawali `PG|` diikuti key=value pairs:

```
PG|event=entry|time=1696000000000|ticker=BATS:BBRI|mode=Composite Score|action=buy|price=1234|score=75|signal=Neutral→Bullish
PG|event=trend_extreme|time=1696000000000|ticker=BATS:BBRI|trendScore=85
PG|event=rsi_oversold|time=1696000000000|ticker=BATS:BBRI|rsi=28
PG|event=rsi_overbought|time=1696000000000|ticker=BATS:BBRI|rsi=72
PG|event=volume_spike|time=1696000000000|ticker=BATS:BBRI|ratio=250
PG|event=smart_money|time=1696000000000|ticker=BATS:BBRI|detected=true
PG|event=choppiness|time=1696000000000|ticker=BATS:BBRI|chop=68
```

### 1.3 Event Types

| Event | Trigger | Fields |
|-------|---------|--------|
| `entry` | Entry trigger (sesuai mode) | `mode`, `action`, `price`, `score`, `signal` |
| `trend_extreme` | Trend ≥80 atau ≤20 | `trendScore` |
| `rsi_oversold` | RSI ≤ threshold oversold | `rsi` |
| `rsi_overbought` | RSI ≥ threshold overbought | `rsi` |
| `volume_spike` | Volume ≥ multiplier MA | `ratio` (% of MA) |
| `smart_money` | Institutional flow detected | `detected` |
| `choppiness` | Chop Index ≥62 (ranging) | `chop` |

---

## 2. TradingView Alert Setup

1. Tambahkan indikator **Saham: Papan Gerak By. Akhmfz** ke chart.
2. Atur **Alert Format → JSON** di grup *Webhook* Settings.
3. Buat alert di TradingView:
   - Condition: **Papan Gerak** → pilih event
   - Frequency: **Once Per Bar Close** (rekomendasi)
   - Webhook URL: endpoint Anda
   - Message: biarkan kosong (TV akan kirim output dari `alert()`)

> **Catatan:** Alert TradingView mengirimkan **semua** kondisi yang terpenuhi
> dalam satu bar. Jika entry trigger dan volume spike terjadi bersamaan,
> dua alert akan dikirim. Filter di sisi penerima jika perlu.

---

## 3. TradersPost Integration

[TradersPost](https://traderspost.io) mendukung parsing kustom.

### Setup Webhook Strategy
1. Buat strategy baru → **Webhook Strategy**.
2. Di field **Parse Alert Strategy**, pilih **Custom**.
3. Mapping field:

| TradersPost Field | Papan Gerak Key | Example |
|-------------------|-----------------|---------|
| Ticker / Symbol | `ticker` | BBRI |
| Action | `action` | buy / sell |
| Price | `price` | 1234 |
| Quantity | — | hitung dari balance |

### Custom Parser
Gunakan webhook URL TradersPost, lalu set parser untuk ekstrak key=value:

```javascript
// Contoh parser JavaScript (di TradersPost)
const parts = alertMessage.split('|');
const data = {};
parts.forEach(part => {
  const [key, val] = part.split('=');
  data[key] = val;
});
return {
  ticker: data.ticker,
  action: data.action,
  price: parseFloat(data.price)
};
```

---

## 4. Pine Connector (MT4/MT5)

[Pine Connector](https://pineconnector.com) menerjemahkan alert ke order
di MetaTrader.

### Format Mapping
Di Pine Connector, set **Custom Mapping**:

```
ticker: {ticker}
action: {action}
price: {price}
```

Parser akan ekstrak nilai dari key=value pair.

> **Catatan untuk IDX:** Pine Connector dirancang untuk Forex & CFD.
> Untuk saham IDX, butuh broker yg support eksekusi via MT4/MT5.

---

## 5. Custom Webhook Server

Contoh penerima Flask sederhana (Python):

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_data(as_text=True)
    parts = data.split('|')
    parsed = {}
    for part in parts:
        if '=' in part:
            k, v = part.split('=', 1)
            parsed[k] = v

    event = parsed.get('event')
    ticker = parsed.get('ticker')
    action = parsed.get('action')

    if event == 'entry' and action:
        print(f"Signal: {action.upper()} {ticker} @ {parsed.get('price')}")
        # Kirim ke broker API — dengan disclaimer!
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(port=8080)
```

---

## 6. Pertimbangan IDX

| Faktor | Dampak | Mitigasi |
|--------|--------|----------|
| Likuiditas tipis | Slippage besar saat eksekusi | Gunakan limit order, hindari market order |
| Auto-rejection | ARA/ARB batasi eksekusi | Filter harga entry di bawah ARA & di atas ARB |
| Settlement T+2 | Dana tersedia 2 hari kerja | Hitung daya beli secara real-time |
| Jam trading pendek | 09:00–15:00 WIB | Alert di luar jam = skip |

**Rekomendasi:** Gunakan **paper trading** minimal 1 bulan sebelum live.

---

## 7. Disclaimer Lengkap

```
⚠️ RISK DISCLAIMER

Skrip ini disediakan untuk tujuan edukasi dan analisis teknikal.
BUKAN merupakan saran investasi atau rekomendasi jual/beli.

Penggunaan fitur webhook dan eksekusi otomatis sepenuhnya
tanggung jawab pengguna. Pasar modal Indonesia memiliki
karakteristik thin market yang dapat menyebabkan:
- Eksekusi tidak sesuai harga alert
- Slippage signifikan
- Kesulitan masuk/keluar posisi

Selalu lakukan due diligence sendiri (DYOR/DYODD).
Penulis tidak bertanggung jawab atas kerugian finansial
yang timbul akibat penggunaan skrip ini.

Dengan menggunakan skrip ini, Anda menyetujui ketentuan di atas.
```

---

*Papan Gerak — Technical Analysis Dashboard untuk IDX*
*Author: Muhammad Akhmal (AKHMFZ)*
