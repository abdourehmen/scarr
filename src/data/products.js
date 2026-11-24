import heroImg from '../assets/hero.png';

const localImages = import.meta.glob('../assets/photo1*.{jpg,webp,png,jpeg}', {
  eager: true,
  import: 'default'
});

const fallbackGallery = Object.values(localImages);

const getGallery = (primaryUrl, index) => {
  const extra1 = fallbackGallery[index % fallbackGallery.length] || heroImg;
  const extra2 = fallbackGallery[(index + 1) % fallbackGallery.length] || heroImg;
  return [primaryUrl, extra1, extra2];
};

const baseCatalog = [
  {
    name: 'Air Max Pulse Triple Black',
    category: 'رياضية',
    price: 7800,
    oldPrice: 9200,
    badge: 'الأكثر مبيعاً',
    sizes: [40, 41, 42, 43, 44],
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'حذاء رياضي عصري بتوسيد مريح للقدم ونعل مرن عالي الثبات للمشي والتدريب.'
  },
  {
    name: 'Court Vision Low Retro White',
    category: 'يومية',
    price: 6400,
    oldPrice: 7500,
    badge: 'جديد',
    sizes: [39, 40, 41, 42, 43, 44],
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    description: 'تصميم يومي كلاسيكي أنيق يسهل تنسيقه مع مختلف الإطلالات اليومية.'
  },
  {
    name: 'Classic Oxford Leather Cognac',
    category: 'كلاسيكية',
    price: 8900,
    oldPrice: 10500,
    badge: 'تخفيض',
    sizes: [40, 41, 42, 43, 44, 45],
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=80',
    description: 'حذاء كلاسيكي بلمسة جلدية فاخرة ونعل مبطن مريح للمناسبات والعمل.'
  },
  {
    name: 'Zoom Pegasus Runner Grey & Volt',
    category: 'رياضية',
    price: 8200,
    oldPrice: null,
    badge: 'محدود',
    sizes: [40, 41, 42, 43, 44],
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',
    description: 'خفيف الوزن مع تهوية ممتازة للقدم وامتصاص فعال للصدمات أثناء الجري.'
  },
  {
    name: 'Suede Street Low Sand',
    category: 'يومية',
    price: 6900,
    oldPrice: 7900,
    badge: 'الأكثر مبيعاً',
    sizes: [39, 40, 41, 42, 43],
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    description: 'إطلالة شبابية ناعمة بلون رملي عصري وخامة مريحة للخرجات اليومية.'
  },
  {
    name: 'Derby Formal Noir Matte',
    category: 'كلاسيكية',
    price: 8500,
    oldPrice: 9800,
    badge: null,
    sizes: [41, 42, 43, 44, 45],
    img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80',
    description: 'حذاء أسود رسمي بتشطيب مطفي راقٍ يجمع بين المظهر الفخم والراحة.'
  },
  {
    name: 'Air Force 07 Pure Platinum',
    category: 'يومية',
    price: 7200,
    oldPrice: 8400,
    badge: 'جديد',
    sizes: [38, 39, 40, 41, 42, 43, 44],
    img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
    description: 'من أكثر الموديلات طلباً بفضل متانته العالية وسهولة تنسيقه اليومي.'
  },
  {
    name: 'Agility Pro Court Crimson',
    category: 'رياضية',
    price: 7600,
    oldPrice: null,
    badge: 'تخفيض',
    sizes: [40, 41, 42, 43, 44],
    img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=900&q=80',
    description: 'ثبات قوي على مختلف الأرضيات مع تصميم جريء يلفت الأنظار.'
  }
];

const editions = [
  { suffix: '', priceDelta: 0, badgeOverride: null },
  { suffix: ' — Pro Edition', priceDelta: 400, badgeOverride: 'جديد' },
  { suffix: ' — Limited Drop', priceDelta: 700, badgeOverride: 'محدود' }
];

export const products = editions.flatMap((edition, edIdx) =>
  baseCatalog.map((item, idx) => {
    const uniqueIndex = edIdx * baseCatalog.length + idx;
    return {
      id: `mock-${uniqueIndex + 1}`,
      name: `${item.name}${edition.suffix}`,
      category: item.category,
      price: item.price + edition.priceDelta,
      oldPrice: item.oldPrice ? item.oldPrice + edition.priceDelta : null,
      badge: edition.badgeOverride || item.badge,
      sizes: item.sizes,
      images: getGallery(item.img, uniqueIndex),
      description: item.description
    };
  })
);