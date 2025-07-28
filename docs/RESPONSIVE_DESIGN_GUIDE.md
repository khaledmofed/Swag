# دليل التصميم المتجاوب (Responsive Design Guide)

## نظرة عامة

تم تحسين الموقع ليكون متجاوباً بالكامل مع جميع أحجام الشاشات، من الهواتف الذكية إلى أجهزة الكمبيوتر المكتبية.

## Breakpoints المستخدمة

```css
xs: 475px   /* الهواتف الصغيرة جداً */
sm: 640px   /* الهواتف الذكية */
md: 768px   /* الأجهزة اللوحية */
lg: 1024px  /* أجهزة الكمبيوتر المحمولة */
xl: 1280px  /* أجهزة الكمبيوتر المكتبية */
2xl: 1536px /* الشاشات الكبيرة */
```

## المكونات المحسنة

### 1. Header

- **الموبايل**: عرض مضغوط مع أزرار أصغر
- **التابلت**: عرض متوسط مع مساحات محسنة
- **الديسكتوب**: عرض كامل مع جميع العناصر

### 2. Banner

- **الموبايل**: نص أصغر وأزرار أكبر للمس
- **التابلت**: أحجام متوسطة
- **الديسكتوب**: أحجام كاملة

### 3. Service Cards

- **الموبايل**: عمود واحد
- **التابلت**: عمودين
- **الديسكتوب**: 4 أعمدة

### 4. Promo Banner

- **الموبايل**: ارتفاع أقل وأيقونات أصغر
- **التابلت والديسكتوب**: أحجام كاملة

## Classes الجديدة المتاحة

### Responsive Text Classes

```css
.text-responsive-xs    /* 0.75rem - 1rem */
/* 0.75rem - 1rem */
.text-responsive-sm    /* 0.875rem - 1.125rem */
.text-responsive-base  /* 1rem - 1.25rem */
.text-responsive-lg    /* 1.125rem - 1.5rem */
.text-responsive-xl    /* 1.25rem - 1.875rem */
.text-responsive-2xl   /* 1.5rem - 2.25rem */
.text-responsive-3xl   /* 1.875rem - 3rem */
.text-responsive-4xl   /* 2.25rem - 3.75rem */
.text-responsive-5xl   /* 3rem - 4.5rem */
.text-responsive-6xl; /* 3.75rem - 6rem */
```

### Responsive Spacing Classes

```css
.space-responsive-xs   /* 0.5rem - 1rem */
/* 0.5rem - 1rem */
.space-responsive-sm   /* 1rem - 1.5rem */
.space-responsive-md   /* 1.5rem - 2.5rem */
.space-responsive-lg   /* 2rem - 4rem */
.space-responsive-xl; /* 3rem - 6rem */
```

### Responsive Grid Classes

```css
.grid-responsive-1     /* عمود واحد */
/* عمود واحد */
.grid-responsive-2     /* عمودين على التابلت+ */
.grid-responsive-3     /* 3 أعمدة على الديسكتوب+ */
.grid-responsive-4; /* 4 أعمدة على الديسكتوب+ */
```

### Responsive Visibility Classes

```css
.mobile-only           /* يظهر فقط على الموبايل */
/* يظهر فقط على الموبايل */
.tablet-only           /* يظهر فقط على التابلت */
.desktop-only          /* يظهر فقط على الديسكتوب */
.hidden-mobile         /* يخفي على الموبايل */
.hidden-tablet         /* يخفي على التابلت */
.hidden-desktop; /* يخفي على الديسكتوب */
```

### Touch-Friendly Classes

```css
.btn-touch/* أزرار مناسبة للمس (44px min) */;
```

### Responsive Image Classes

```css
.img-responsive        /* صورة متجاوبة */
/* صورة متجاوبة */
.img-responsive-square /* صورة مربعة */
.img-responsive-16-9   /* صورة بنسبة 16:9 */
.img-responsive-4-3; /* صورة بنسبة 4:3 */
```

### Responsive Typography Scale

```css
.text-scale-xs         /* clamp(0.75rem, 2vw, 0.875rem) */
/* clamp(0.75rem, 2vw, 0.875rem) */
.text-scale-sm         /* clamp(0.875rem, 2.5vw, 1rem) */
.text-scale-base       /* clamp(1rem, 3vw, 1.125rem) */
.text-scale-lg         /* clamp(1.125rem, 3.5vw, 1.25rem) */
.text-scale-xl         /* clamp(1.25rem, 4vw, 1.5rem) */
.text-scale-2xl        /* clamp(1.5rem, 5vw, 1.875rem) */
.text-scale-3xl        /* clamp(1.875rem, 6vw, 2.25rem) */
.text-scale-4xl        /* clamp(2.25rem, 7vw, 3rem) */
.text-scale-5xl        /* clamp(3rem, 8vw, 3.75rem) */
.text-scale-6xl; /* clamp(3.75rem, 10vw, 4.5rem) */
```

## مكون ResponsiveContainer

مكون مساعد للتجاوب يمكن استخدامه في جميع أنحاء التطبيق:

```tsx
import { ResponsiveContainer } from "@/components/common/ResponsiveContainer";

// استخدام بسيط
<ResponsiveContainer>
  <h1>محتوى متجاوب</h1>
</ResponsiveContainer>

// مع خيارات مخصصة
<ResponsiveContainer
  maxWidth="lg"
  padding="xl"
  as="section"
  className="bg-gray-100"
>
  <h1>محتوى متجاوب مخصص</h1>
</ResponsiveContainer>
```

### خيارات ResponsiveContainer

#### maxWidth

- `"sm"` - max-width: 24rem
- `"md"` - max-width: 28rem
- `"lg"` - max-width: 32rem
- `"xl"` - max-width: 36rem
- `"2xl"` - max-width: 42rem
- `"full"` - max-width: 100%

#### padding

- `"none"` - بدون padding
- `"sm"` - px-2 sm:px-4
- `"md"` - px-4 sm:px-6 lg:px-8
- `"lg"` - px-6 sm:px-8 lg:px-12
- `"xl"` - px-8 sm:px-12 lg:px-16

#### as

- `"div"` (افتراضي)
- `"section"`
- `"article"`
- `"main"`
- `"header"`
- `"footer"`

## أفضل الممارسات

### 1. Mobile-First Approach

ابدأ دائماً بتصميم للموبايل أولاً، ثم أضف التحسينات للشاشات الأكبر:

```css
/* بداية من الموبايل */
.element {
  font-size: 1rem;
  padding: 1rem;
}

/* تحسين للتابلت */
@media (min-width: 640px) {
  .element {
    font-size: 1.125rem;
    padding: 1.5rem;
  }
}

/* تحسين للديسكتوب */
@media (min-width: 1024px) {
  .element {
    font-size: 1.25rem;
    padding: 2rem;
  }
}
```

### 2. استخدام Classes المتجاوبة

```tsx
// بدلاً من
<h1 className="text-2xl md:text-4xl lg:text-6xl">

// استخدم
<h1 className="text-responsive-2xl">
```

### 3. Touch-Friendly Elements

```tsx
// للأزرار والروابط
<button className="btn-touch">زر مناسب للمس</button>
```

### 4. Responsive Images

```tsx
// للصور
<img src="/image.jpg" alt="وصف" className="img-responsive" />
```

### 5. Responsive Grids

```tsx
// للشبكات
<div className="grid grid-responsive-4 gap-4">
  {/* العناصر ستظهر بشكل متجاوب */}
</div>
```

## اختبار التجاوب

### أدوات الاختبار

1. **Chrome DevTools** - Device Toolbar
2. **Firefox Responsive Design Mode**
3. **Safari Web Inspector**
4. **أجهزة حقيقية** - الأفضل للاختبار

### أحجام الشاشات للاختبار

- **iPhone SE**: 375px
- **iPhone 12**: 390px
- **Samsung Galaxy**: 360px
- **iPad**: 768px
- **iPad Pro**: 1024px
- **Desktop**: 1280px+
- **Large Desktop**: 1536px+

### اختبار الأداء

- **Lighthouse** - Mobile Performance
- **PageSpeed Insights** - Mobile Score
- **WebPageTest** - Mobile Testing

## استكشاف الأخطاء

### مشاكل شائعة

1. **النص صغير جداً على الموبايل**

   - استخدم `text-responsive-*` classes
   - تأكد من `font-size` مناسب

2. **الأزرار صغيرة جداً للمس**

   - استخدم `btn-touch` class
   - تأكد من `min-height: 44px`

3. **المساحات غير متوازنة**

   - استخدم `space-responsive-*` classes
   - تحقق من `padding` و `margin`

4. **الصور لا تتكيف**
   - استخدم `img-responsive` class
   - تأكد من `object-fit: cover`

### أدوات التصحيح

```css
/* إضافة حدود للتصحيح */
.debug * {
  outline: 1px solid red;
}

/* إظهار breakpoints */
.debug::before {
  content: "xs";
  position: fixed;
  top: 0;
  left: 0;
  background: red;
  color: white;
  padding: 4px;
  z-index: 9999;
}

@media (min-width: 640px) {
  .debug::before {
    content: "sm";
    background: orange;
  }
}

@media (min-width: 768px) {
  .debug::before {
    content: "md";
    background: yellow;
    color: black;
  }
}

@media (min-width: 1024px) {
  .debug::before {
    content: "lg";
    background: green;
  }
}

@media (min-width: 1280px) {
  .debug::before {
    content: "xl";
    background: blue;
  }
}

@media (min-width: 1536px) {
  .debug::before {
    content: "2xl";
    background: purple;
  }
}
```

## التحديثات المستقبلية

### خطط التحسين

1. **تحسين الأداء على الموبايل**
2. **إضافة المزيد من Classes المتجاوبة**
3. **تحسين تجربة المستخدم على الأجهزة اللوحية**
4. **إضافة دعم للشاشات الكبيرة جداً**

### المكونات المطلوب تحسينها

- [ ] Footer
- [ ] Product Cards
- [ ] Blog Cards
- [ ] Forms
- [ ] Modals
- [ ] Navigation Menus

## المراجع

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Google Mobile-First Indexing](https://developers.google.com/search/mobile-sites/mobile-first-indexing)
- [Web.dev Responsive Design](https://web.dev/responsive-design/)
