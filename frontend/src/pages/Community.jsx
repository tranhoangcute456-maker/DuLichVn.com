import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock posts fallback
const MOCK_POSTS = [
  {
    id: 1, user_name: 'Minh Phượt', avatar_url: 'https://i.pravatar.cc/150?img=11',
    location: 'Sapa, Lào Cai',
    content: 'Sáng sớm ở Sapa mà gặp được màn sương này thì không còn gì tuyệt hơn nữa! Đỉnh núi ẩn trong mây, ruộng bậc thang vàng rực — đúng là thiên đường trần gian. 🌿✨ #SapaMuaLua #Trekking',
    image_url: 'https://media.vietravel.com/images/Content/dia-diem-du-lich-sapa-1.png',
    images: [],
    likes: 142, comments: 28, created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2, user_name: 'Thu Hội An', avatar_url: 'https://i.pravatar.cc/150?img=5',
    location: 'Hội An, Quảng Nam',
    content: 'Đêm Rằm ở Hội An mà không thả đèn hoa đăng thì coi như chưa đến 🏮 Ánh đèn lung linh phản chiếu trên mặt sông Hoài — khoảnh khắc này sẽ theo mình cả đời. #HoiAnByNight #HoaDang',
    image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800',
    images: [],
    likes: 89, comments: 14, created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3, user_name: 'Foodie Hà Nội', avatar_url: 'https://i.pravatar.cc/150?img=33',
    location: 'Hà Nội',
    content: 'Phở 24h ở Hà Nội mà ăn buổi sáng mới thật sự là trải nghiệm. Nước dùng trong vắt, thơm ngào ngạt từ ngoài đường vào. Đây mới là bữa sáng của người Hà Nội xịn xò! 🍜 #FoodTourHanoi',
    image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800',
    images: [],
    likes: 63, comments: 9, created_at: new Date(Date.now() - 18000000).toISOString(),
  },
];

const TOP_USERS = [
  { name: 'Phượt Thủ 9x', ava: 'https://i.pravatar.cc/150?img=11', followers: '5.2k', badge: '🌟 Thổ Địa' },
  { name: 'Yêu Bếp & Đi', ava: 'https://i.pravatar.cc/150?img=5', followers: '4.8k', badge: '🍜 Food Expert' },
  { name: 'Lang Thang VN', ava: 'https://i.pravatar.cc/150?img=33', followers: '3.1k', badge: '📸 Nhiếp Ảnh' },
  { name: 'Cây Bút Vàng', ava: 'https://i.pravatar.cc/150?img=15', followers: '2.7k', badge: '✍️ Cây Bút' },
];

const TRENDING_TAGS = [
  { tag: '#SapaMuaLua', posts: 1000 },
  { tag: '#HoiAnByNight', posts: 877 },
  { tag: '#FoodTourHanoi', posts: 754 },
  { tag: '#BienDaNang', posts: 631 },
  { tag: '#CheckinPhuQuoc', posts: 508 },
];

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [imgError, setImgError] = useState(false);
  const FALLBACK = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800';

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => liked ? c - 1 : c + 1);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-[#0D2D1F] rounded-[1.5rem] border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300"
    >
      {/* Post header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.avatar_url || 'https://i.pravatar.cc/150'}
            alt="avatar"
            className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37]/30"
            onError={(e) => { e.target.src = 'https://i.pravatar.cc/150'; }}
          />
          <div>
            <h5 className="font-bold text-[#F5F2EB] text-sm hover:text-[#D4AF37] cursor-pointer transition-colors">{post.user_name}</h5>
            <div className="flex items-center gap-1.5 text-xs text-white/40 mt-0.5">
              {post.location && <><span className="text-[#D4AF37]">📍</span><span>{post.location}</span><span>·</span></>}
              <span>{timeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>
        <button className="text-white/30 hover:text-white transition-colors text-xl leading-none px-2">···</button>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <p className="text-white/75 text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="w-full aspect-[4/3] overflow-hidden bg-[#112418] relative">
          <img
            src={imgError ? FALLBACK : post.image_url}
            alt="post"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-4 flex items-center gap-1 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${liked ? 'bg-red-500/20 text-red-400' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}
        >
          <span className="text-base">{liked ? '❤️' : '🤍'}</span> {likeCount}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white/40 hover:bg-white/5 hover:text-white/70 transition-all">
          <span className="text-base">💬</span> {post.comments || 0}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white/40 hover:bg-white/5 hover:text-white/70 transition-all">
          <span className="text-base">📤</span>
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${saved ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}
        >
          <span className="text-base">{saved ? '🔖' : '🏷️'}</span> {saved ? 'Đã lưu' : 'Lưu'}
        </button>
      </div>
    </motion.article>
  );
}

// ============================================================
function Community() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostLocation, setNewPostLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      const data = await res.json();
      if (data && data.length > 0) setPosts(data);
      else setPosts(MOCK_POSTS);
    } catch { setPosts(MOCK_POSTS); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = async () => {
    if (!loggedInUser) { navigate('/suggestions'); return; }
    if (!newPostContent.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: loggedInUser.id, content: newPostContent, rating: 5, image_url: '' }),
      });
      const data = await res.json();
      if (data.status === 'success') { setNewPostContent(''); setNewPostLocation(''); fetchPosts(); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="bg-[#0A241A] min-h-screen pt-24 pb-10 font-sans">
      <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ===== CỘT TRÁI ===== */}
        <aside className="hidden lg:flex flex-col gap-5 lg:col-span-1 sticky top-24 h-fit">
          {/* Trending */}
          <div className="bg-[#0D2D1F] p-6 rounded-[1.5rem] border border-white/5">
            <h4 className="font-black uppercase tracking-widest text-[10px] text-[#D4AF37] mb-4 flex items-center gap-2">
              🔥 Đang Thịnh Hành
            </h4>
            <ul className="space-y-4">
              {TRENDING_TAGS.map((item, i) => (
                <li key={i} className="group cursor-pointer">
                  <span className="font-bold text-sm text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors block leading-tight">{item.tag}</span>
                  <span className="text-xs text-white/30 flex items-center gap-1 mt-0.5">
                    <span className="text-[#D4AF37]">📈</span> {item.posts} bài viết
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weekly Challenge */}
          <div
            className="relative p-6 rounded-[1.5rem] text-white text-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0A4D2E 0%, #1a6b40 50%, #0A3D28 100%)' }}
          >
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800')" }}
            />
            <div className="relative z-10">
              <div className="text-3xl mb-2">🌅</div>
              <h4 className="font-heading text-xl font-bold mb-2">Thử Thách Tuần</h4>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                Chia sẻ 1 bức ảnh hoàng hôn đẹp nhất của bạn để nhận huy hiệu độc quyền!
              </p>
              <button className="bg-[#D4AF37] text-black w-full py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
                Tham Gia Ngay
              </button>
            </div>
          </div>
        </aside>

        {/* ===== CỘT GIỮA: FEED ===== */}
        <main className="col-span-1 lg:col-span-2 space-y-5">
          {/* Post Form */}
          <div className="bg-[#0D2D1F] p-5 rounded-[1.5rem] border border-white/5">
            <div className="flex gap-4">
              <img
                src={loggedInUser?.avatar_url || 'https://i.pravatar.cc/150'}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37]/30 flex-shrink-0"
                alt="ava"
                onError={(e) => { e.target.src = 'https://i.pravatar.cc/150'; }}
              />
              <div className="flex-1">
                <textarea
                  placeholder={loggedInUser ? 'Hôm nay bạn đã đến đâu? Chia sẻ với cộng đồng...' : 'Vui lòng đăng nhập để chia sẻ...'}
                  className="w-full bg-[#112418] text-white placeholder-white/20 p-4 rounded-xl resize-none h-24 outline-none focus:ring-2 focus:ring-[#D4AF37]/40 text-sm border border-white/5 transition-all"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  disabled={!loggedInUser}
                />
                {/* Location input */}
                {loggedInUser && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#D4AF37] text-sm">📍</span>
                    <input
                      type="text"
                      placeholder="Thêm vị trí..."
                      className="flex-1 bg-transparent text-white/60 placeholder-white/20 text-xs outline-none border-b border-white/10 pb-1"
                      value={newPostLocation}
                      onChange={(e) => setNewPostLocation(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
              <div className="flex gap-3 text-white/40">
                <button className="hover:text-[#D4AF37] flex items-center gap-1.5 text-xs font-bold transition-colors">
                  <span className="text-base">🖼️</span> Ảnh/Video
                </button>
                <button className="hover:text-[#D4AF37] flex items-center gap-1.5 text-xs font-bold transition-colors">
                  <span className="text-base">📍</span> Check-in
                </button>
              </div>
              <button
                onClick={handlePost}
                disabled={loading || !loggedInUser || !newPostContent.trim()}
                className="bg-[#D4AF37] text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white disabled:opacity-30 transition-all"
              >
                {loading ? '⏳ Đang đăng...' : '✈️ Chia Sẻ'}
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-5">
            {posts.length === 0 ? (
              <p className="text-center text-white/30 py-10">Chưa có bài viết nào.</p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </main>

        {/* ===== CỘT PHẢI: TOP CONTRIBUTORS ===== */}
        <aside className="hidden lg:flex flex-col gap-5 lg:col-span-1 sticky top-24 h-fit">
          <div className="bg-[#0D2D1F] p-6 rounded-[1.5rem] border border-white/5">
            <h4 className="font-black uppercase tracking-widest text-[10px] text-[#C27A5B] mb-5 flex items-center gap-2">
              🏆 Người Truyền Cảm Hứng
            </h4>
            <ul className="space-y-4">
              {TOP_USERS.map((user, i) => (
                <li key={i} className="group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={user.ava} className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-[#D4AF37]/50 transition-colors" alt="ava" />
                      {i === 0 && <span className="absolute -top-1 -right-1 text-xs">👑</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors block truncate">{user.name}</span>
                      <span className="text-[10px] text-[#D4AF37]/70 font-bold">{user.badge}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-[#D4AF37]">{user.followers}</span>
                      <p className="text-[10px] text-white/30">followers</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button className="w-full mt-5 border border-white/10 text-white/40 text-xs font-bold py-2.5 rounded-full hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all uppercase tracking-widest">
              Xem Tất Cả
            </button>
          </div>

          {/* App download CTA */}
          <div className="bg-[#0D2D1F] p-6 rounded-[1.5rem] border border-white/5 text-center">
            <div className="text-3xl mb-3">🌍</div>
            <h4 className="text-[#F5F2EB] font-bold text-sm mb-2">ExploreVN Community</h4>
            <p className="text-white/40 text-xs leading-relaxed mb-4">Chia sẻ hành trình, kết nối với những người yêu du lịch khắp Việt Nam.</p>
            <div className="flex items-center gap-2 justify-center text-white/30 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span>1.2k người đang online</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default Community;