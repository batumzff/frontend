# UVW Mühendislik Görev Yönetimi Sistemi - Frontend

Bu proje, UVW Mühendislik için geliştirilmiş görev yönetimi sisteminin frontend kısmıdır. Kullanıcı arayüzü, kimlik doğrulama ve veri görselleştirme işlevlerini sağlar.

## Canlı Demo

Frontend uygulaması şu adreste çalışmaktadır: [https://frontend-ecru-phi-68.vercel.app/](https://frontend-ecru-phi-68.vercel.app/)

## Kullanılan Teknolojiler

- **React**: Kullanıcı arayüzü kütüphanesi
- **Next.js**: React framework'ü
- **Redux Toolkit**: Durum yönetimi
- **Axios**: HTTP istemcisi
- **Tailwind CSS**: Stil kütüphanesi
- **React Hook Form**: Form yönetimi
- **React Icons**: İkon kitaplığı

## Mimari Yapı

Proje, modern bir frontend mimarisine sahiptir:

- **Pages**: Uygulama sayfaları ve rotaları
- **Components**: Yeniden kullanılabilir UI bileşenleri
- **Store**: Redux durum yönetimi
- **Utils**: Yardımcı fonksiyonlar ve API yapılandırması
- **Styles**: Global stiller ve Tailwind yapılandırması

```ascii
├── pages/              # Uygulama sayfaları
│   ├── _app.js
│   ├── index.js
│   ├── login.js
│   ├── register.js
│   ├── dashboard.js
│   └── ...
├── components/         # UI bileşenleri
│   ├── auth/
│   │   ├── LoginForm.js
│   │   └── RegisterForm.js
│   ├── layout/
│   │   ├── Layout.js
│   │   ├── Header.js
│   │   └── Sidebar.js
│   ├── projects/
│   │   ├── ProjectList.js
│   │   ├── ProjectCard.js
│   │   └── ProjectForm.js
│   └── tasks/
│       ├── TaskList.js
│       ├── TaskItem.js
│       └── TaskForm.js
├── store/              # Redux store ve slice'lar
│   ├── index.js
│   ├── authSlice.js
│   ├── projectSlice.js
│   └── taskSlice.js
├── utils/              # Yardımcı fonksiyonlar
│   ├── api.js
│   └── helpers.js
└── styles/             # Stiller
    └── globals.css
```

## Özellikler

### Kimlik Doğrulama ve Yetkilendirme
- Kullanıcı kaydı ve girişi
- JWT tabanlı kimlik doğrulama
- Rol temelli erişim kontrolü
- Oturum yönetimi

### Proje Yönetimi
- Proje listesi görüntüleme
- Proje detayları
- Proje oluşturma ve düzenleme
- Projelere takım üyesi ekleme/çıkarma

### Görev Yönetimi
- Görev listesi görüntüleme
- Görev oluşturma ve düzenleme
- Görev atama
- Durum ve öncelik güncelleme

### Kullanıcı Arayüzü
- Responsive tasarım
- Koyu/açık tema desteği
- İnteraktif bileşenler
- Toast bildirimleri

## Kurulum

1. Repository'yi klonlayın:
   ```
   git clone <repo-url>
   cd uvw/frontend
   ```

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. `.env.local` dosyasını oluşturun:
   ```
   NEXT_PUBLIC_API_URL=https://backend-fv1y.onrender.com/api
   ```

4. Geliştirme sunucusunu başlatın:
   ```
   npm run dev
   ```

5. Tarayıcınızda [http://localhost:3001](http://localhost:3001) adresine gidin.

## Test Kullanıcıları

Sistemi test etmek için aşağıdaki kullanıcıları kullanabilirsiniz:

- **Admin**: admin@mail.com / adminpass
- **Manager**: manager@mail.com / managerpass
- **Developer**: dev1@mail.com / dev1pass

## Dağıtım (Deployment)

Frontend uygulaması Vercel üzerinde deploy edilmiştir. Yeni bir dağıtım için:

1. Vercel CLI'yı yükleyin:
   ```
   npm install -g vercel
   ```

2. Deploy edin:
   ```
   vercel
   ```

## Mimari Diyagram

```
┌─────────────────────────────────────────────────────┐
│                    Next.js App                      │
│                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────┐  │
│  │    Pages    │    │  Components │    │ Layouts │  │
│  └─────────────┘    └─────────────┘    └─────────┘  │
│          │                 │                │       │
│          └────────┬────────┴────────┬──────┘        │
│                   │                 │               │
│            ┌─────────────┐   ┌─────────────┐        │
│            │Redux Store  │   │   Hooks     │        │
│            └─────────────┘   └─────────────┘        │
│                   │                 │               │
│                   └────────┬────────┘               │
│                            │                        │
│                     ┌─────────────┐                 │
│                     │  API Utils  │                 │
│                     └─────────────┘                 │
└────────────────────────│────────────────────────────┘
                         │
                 ┌───────▼──────┐
                 │  Backend API │
                 └──────────────┘
```

## Ek Özellikler

- **SSR (Server-Side Rendering)**: Next.js kullanarak sayfa yüklemelerinde daha iyi performans
- **Responsive Design**: Tüm cihazlarda optimum kullanıcı deneyimi
- **Form Validation**: React Hook Form ile form doğrulama
- **Error Handling**: Kapsamlı hata yakalama ve kullanıcı bildirimleri
- **Persisted State**: Sayfa yenilemeleri arasında durum koruması 