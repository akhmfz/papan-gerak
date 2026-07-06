# AI.md — AI Collaboration Context

Proyek: **Saham: Papan Gerak By. Akhmfz**
Platform: TradingView Pine Script v6 | Market: IDX | Status: Alpha Development

---

## Project Identity

| Atribut | Nilai |
|---------|-------|
| Nama | Saham: Papan Gerak By. Akhmfz |
| Tipe | Open Source TradingView Indicator |
| Bahasa | Pine Script v6 |
| Market | Indonesia Stock Exchange (IDX) |
| Target | TradingView |
| Status | Alpha Development (v0.2.0-alpha) |

## Product Philosophy

1. **Indonesia First** — Dikalibrasi untuk pasar Indonesia, bukan adaptasi dari AS.
2. **Methodology Before Code** — Metodologi didahulukan.
3. **Simplicity** — Satu skor, satu sinyal.
4. **Multi-Dimensi** — Trend, momentum, volatilitas, volume.
5. **Living Documentation** — Setiap perubahan penting harus didokumentasikan.

## AI Roles

| Role | Contoh AI | Tanggung Jawab |
|------|-----------|----------------|
| **Product Owner** | Muhammad Akhmal | Visi, prioritas, approve perubahan besar |
| **AI Developer** | Claude | Implementasi kode, refactoring, bug fixing |
| **AI Reviewer** | ChatGPT | Code review, regression review |

## Context Loading Order

1. `docs/DEVELOPMENT.md` — cari `# Changelog` dan `# Backlog`
2. File source target
3. `docs/ARCHITECTURE.md` (jika metodologi terlibat)

## Golden Rules

1. GitHub Repository adalah **Single Source of Truth**.
2. **No Silent Changes** — semua perubahan wajib tercatat.
3. Dokumentasi mengikuti implementasi.
4. Product Owner pemegang keputusan akhir.

## Standard Development Flow

```
Request → Analysis → Proposal → Approval → Implementation → Testing → Documentation → Commit → Review
```

## Constraints

AI **tidak boleh**:
- Mengubah metodologi tanpa persetujuan PO
- Silent changes
- Mengubah perilaku indikator tanpa catatan di CHANGELOG
- Menambahkan fitur di atas fondasi yang belum diverifikasi

## Related Projects

- **Papan Instrumen** — Fundamental Dashboard IDX (sister product)
- **Papan Gerak** — Teknikal Dashboard IDX (this project)
