import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LocationCard from '../components/LocationCard';
import AuthModal from '../components/AuthModal';

// ============================================================
// MOCK DATA - Dùng cho UI khi Backend chưa sẵn sàng
// ============================================================
const MOCK_GPS_RESULTS = [
  { id: 1, name: 'Hội An', location: 'Quảng Nam', distance: 30, travel_time: 45, tag: 'Văn Hoá', best_month_start: 2, best_month_end: 4, image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800' },
  { id: 2, name: 'Bà Nà Hills', location: 'Đà Nẵng', distance: 40, travel_time: 60, tag: 'Check-in', best_month_start: 3, best_month_end: 8, image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800' },
  { id: 3, name: 'Mỹ Sơn', location: 'Quảng Nam', distance: 70, travel_time: 90, tag: 'Lịch Sử', best_month_start: 2, best_month_end: 5, image_url: 'https://ik.imagekit.io/tvlk/blog/2023/09/thanh-dia-my-son-32.jpg?tr=q-70,c-at_max,w-800,h-600' },
];

const TRENDING = [
  { id: 1, name: 'Đà Lạt', location: 'Lâm Đồng', views: '12.4k', badge: '🔥 Đang Hot', season: 'T11 - T3', image_url: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/093/257/products/thung-lung-ngan-hoa.jpg?v=1731570795333' },
  { id: 2, name: 'Phú Quốc', location: 'Kiên Giang', views: '10.1k', badge: '🔥 Đang Hot', season: 'T11 - T4', image_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800' },
  { id: 3, name: 'Hạ Long', location: 'Quảng Ninh', views: '9.8k', badge: '⭐ Top Tháng 5', season: 'T9 - T11', image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800' },
  { id: 4, name: 'Sapa', location: 'Lào Cai', views: '8.2k', badge: '⭐ Top Tháng 5', season: 'T9 - T11', image_url: 'https://media.vietravel.com/images/Content/dia-diem-du-lich-sapa-1.png' },
];

const REVIEWS = [
  { id: 1, user: 'Minh Tuấn', avatar: 'https://i.pravatar.cc/150?img=11', location: 'Hội An', rating: 5, content: 'Không gian tuyệt vời, ánh đèn lồng lung linh vào buổi tối. Thực sự là một trải nghiệm không thể quên!', date: '5/2026' },
  { id: 2, user: 'Thu Hương', avatar: 'https://i.pravatar.cc/150?img=5', location: 'Phú Quốc', rating: 5, content: 'Biển xanh, cát trắng, nước trong vắt. Mình đã chụp được những bức ảnh đẹp nhất cuộc đời ở đây.', date: '4/2026' },
  { id: 3, user: 'Việt Anh', avatar: 'https://i.pravatar.cc/150?img=15', location: 'Sapa', rating: 4, content: 'Ruộng bậc thang mùa lúa chín vàng rực rỡ. Đường lên đỉnh Fansipan cũng rất đáng thử!', date: '10/2025' },
];

const CATEGORIES = [
  { label: 'Chữa Lành & Thiên Nhiên', icon: '🌿', desc: 'Rừng, hang động, cắm trại', color: 'from-green-900 to-green-700' },
  { label: 'Biển Đảo Mùa Hè', icon: '🌊', desc: 'Resort, lặn san hô, hoàng hôn', color: 'from-blue-900 to-blue-700' },
  { label: 'Văn Hoá & Lịch Sử', icon: '🏛️', desc: 'Phố cổ, di tích, bảo tàng', color: 'from-amber-900 to-amber-700' },
  { label: 'Phượt & Khám Phá', icon: '🧭', desc: 'Đèo, trekking, cung đường đẹp', color: 'from-rose-900 to-rose-700' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };

// ============================================================

function Suggestions() {
  const [startLocation, setStartLocation] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [gpsResults, setGpsResults] = useState(MOCK_GPS_RESULTS);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`http://localhost:5000/api/travel-suggestions?userLat=${latitude}&userLng=${longitude}&currentMonth=${selectedMonth}`);
        const result = await res.json();
        if (result.data && result.data.length > 0) setGpsResults(result.data);
      } catch (err) {
        // Fallback to mock data if backend unavailable
        console.log('Dùng dữ liệu mẫu do backend chưa sẵn sàng.');
      }
    }, () => console.log('Không thể lấy vị trí GPS.'));
  }, [selectedMonth]);

  const handleManualSearch = async () => {
    if (!user) { setIsAuthOpen(true); return; }
    if (!startLocation) return;
    setLoading(true);
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startLocation)}`);
      const geoData = await geoRes.json();
      if (geoData.length > 0) {
        const { lat, lon } = geoData[0];
        const res = await fetch(`http://localhost:5000/api/travel-suggestions?userLat=${lat}&userLng=${lon}&currentMonth=${selectedMonth}`);
        const result = await res.json();
        setSearchResults(result.data || []);
      } else {
        alert('Không tìm thấy vị trí này!');
      }
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A241A]">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={(userData) => setUser(userData)} />

      {/* ===== 1. HERO SEARCH BANNER ===== */}
      <section className="relative h-[65vh] flex flex-col justify-center items-center px-4 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074')" }}
        />
        {/* Gradient overlay - smooth dark transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0A241A]" />

        <div className="relative z-10 w-full max-w-5xl text-center space-y-8">
          {/* Eyebrow label */}
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-[#D4AF37] font-bold uppercase tracking-[0.35em] text-xs"
          >
            ExploreVN · Gợi Ý Du Lịch
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white drop-shadow-2xl leading-tight"
          >
            Khởi Đầu <span className="text-[#D4AF37] italic font-light">Hành Trình</span>
          </motion.h1>

          {/* Search Bar - Dark themed */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#112418]/80 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/10 flex flex-col md:flex-row items-center gap-0 w-full overflow-hidden"
          >
            <div className="flex-[3] relative flex items-center w-full">
              <span className="absolute left-5 text-xl text-[#D4AF37]">📍</span>
              <input
                className="w-full py-5 px-14 bg-transparent outline-none font-semibold text-white placeholder-white/40 text-base border-b md:border-b-0 md:border-r border-white/10"
                placeholder="Xuất phát từ đâu?"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              />
            </div>
            <div className="flex-1 relative flex items-center justify-center w-full">
              <span className="absolute left-5 text-xl">🗓️</span>
              <select
                className="w-full py-5 pl-14 pr-5 bg-transparent outline-none font-semibold text-white/80 text-base cursor-pointer appearance-none border-b md:border-b-0 md:border-r border-white/10"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1} className="bg-[#0A241A]">Tháng {i + 1}</option>)}
              </select>
            </div>
            <button
              onClick={handleManualSearch}
              className="flex-shrink-0 w-full md:w-auto bg-[#D4AF37] text-black px-10 py-5 font-black hover:bg-white transition-all duration-300 uppercase tracking-widest text-sm"
            >
              {loading ? '⏳ Đang tìm...' : '🔍 Tìm Kiếm'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== 2. CATEGORIES / GỢI Ý THEO SỞ THÍCH ===== */}
      <section className="max-w-[1200px] mx-auto px-5 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
          <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-xs mb-3">Phong Cách Du Lịch</p>
          <h2 className="text-4xl font-heading font-bold text-white">Bạn Đang Tìm Kiếm <span className="text-[#C27A5B] italic font-light">Điều Gì?</span></h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } } }}
              className={`group relative rounded-[1.5rem] p-6 cursor-pointer overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 bg-gradient-to-br ${cat.color} hover:scale-[1.03]`}
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="font-bold text-white text-base mb-1 leading-tight">{cat.label}</h3>
              <p className="text-white/60 text-xs">{cat.desc}</p>
              <div className="absolute bottom-3 right-4 text-white/20 group-hover:text-[#D4AF37]/60 transition-colors text-xl">→</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== 3. KẾT QUẢ TÌM KIẾM THỦ CÔNG ===== */}
      {searchResults.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 py-10">
          <div className="bg-[#112418] p-10 rounded-[2rem] border border-white/10">
            <h3 className="text-4xl font-heading font-bold text-[#F5F2EB] mb-10 text-center">Lộ Trình Đề Xuất <span className="text-[#D4AF37] italic font-light">Cho Bạn</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((loc, idx) => (
                <div key={loc.id} className={`animate-in fade-in slide-in-from-bottom-10 duration-700 delay-${idx * 100}`}>
                  <LocationCard loc={loc} month={selectedMonth} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 4. TRENDING - ĐIỂM ĐẾN ĐANG THỊNH HÀNH ===== */}
      <section className="max-w-[1200px] mx-auto px-5 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-xs mb-3">Xu Hướng Tháng {selectedMonth}</p>
            <h2 className="text-4xl font-heading font-bold text-[#F5F2EB]">Điểm Đến <span className="text-[#D4AF37] italic font-light">Đang Thịnh Hành</span></h2>
          </div>
          <p className="text-white/50 text-sm mt-4 md:mt-0">Dựa trên tìm kiếm của cộng đồng ExploreVN</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRENDING.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } } }}
              className="group relative h-[300px] rounded-[1.5rem] overflow-hidden cursor-pointer border border-white/5 hover:border-[#D4AF37]/40 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all duration-500"
            >
              <img src={dest.image_url} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-wider">
                {dest.badge}
              </div>
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <h3 className="text-xl font-heading font-bold text-white mb-1">{dest.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-white/60 text-xs flex items-center gap-1">📍 {dest.location}</p>
                  <p className="text-[#D4AF37] text-xs font-bold flex items-center gap-1">👁 {dest.views}</p>
                </div>
                <div className="mt-2 text-white/50 text-[10px] uppercase tracking-widest">Mùa đẹp: {dest.season}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== 5. GẦN BẠN NHẤT (GPS) ===== */}
      <section className="max-w-[1200px] mx-auto px-5 py-16 border-t border-white/5">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
          <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-xs mb-3">Vị Trí Của Bạn</p>
          <h2 className="text-4xl font-heading font-bold text-[#F5F2EB]">Gần Bạn <span className="text-[#C27A5B] italic font-light">Nhất</span></h2>
          <p className="text-white/50 text-sm mt-3">Được gợi ý tự động dựa trên vị trí GPS hiện tại của bạn</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {gpsResults.map((loc, i) => (
            <motion.div
              key={loc.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } } }}
            >
              <LocationCard loc={loc} month={selectedMonth} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== 6. ĐÁNH GIÁ TỪ CỘNG ĐỒNG ===== */}
      <section className="max-w-[1200px] mx-auto px-5 py-16 border-t border-white/5">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
          <p className="text-[#C27A5B] font-bold uppercase tracking-[0.3em] text-xs mb-3">Cộng Đồng ExploreVN</p>
          <h2 className="text-4xl font-heading font-bold text-[#F5F2EB]">Góc <span className="text-[#D4AF37] italic font-light">Chia Sẻ</span></h2>
          <p className="text-white/50 text-sm mt-3">Trải nghiệm thực tế từ những người đã đi</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } } }}
              className="bg-[#112418] rounded-[1.5rem] p-8 border border-white/5 hover:border-[#D4AF37]/30 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)] transition-all duration-500 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, s) => <span key={s} className="text-[#D4AF37] text-sm">★</span>)}
                {[...Array(5 - review.rating)].map((_, s) => <span key={s} className="text-white/20 text-sm">★</span>)}
              </div>
              {/* Quote */}
              <p className="text-white/70 text-sm leading-relaxed italic flex-1">"{review.content}"</p>
              {/* Location tag */}
              <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">📍 {review.location}</div>
              {/* User info */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]/30" />
                <div>
                  <p className="text-white font-bold text-sm">{review.user}</p>
                  <p className="text-white/40 text-xs">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Suggestions;