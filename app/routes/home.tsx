import type { Route } from "./+types/home";
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "시립서대문농아인복지관 - 키오스크 시스템" },
    { name: "description", content: "복지관 층별 안내 키오스크 시스템" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* 로고/아이콘 영역 */}
        <div className="mb-12">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-5xl font-bold text-white">🏢</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            시립서대문농아인복지관
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            디지털 안내 시스템
          </p>
        </div>

        {/* 메인 버튼들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link
            to="/kiosk"
            className="group bg-white rounded-3xl shadow-2xl p-12 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border-4 border-transparent hover:border-blue-300"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-3xl text-white">🗺️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              키오스크 모드
            </h2>
            <p className="text-lg text-gray-600">
              터치스크린으로 층별 안내 보기
            </p>
          </Link>

          <Link
            to="/admin"
            className="group bg-white rounded-3xl shadow-2xl p-12 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border-4 border-transparent hover:border-purple-300"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-3xl text-white">⚙️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              관리자 모드
            </h2>
            <p className="text-lg text-gray-600">
              건물, 층, 방 정보 관리하기
            </p>
          </Link>
        </div>

        {/* 기능 소개 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">주요 기능</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🏢</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">건물별 안내</h4>
              <p className="text-sm text-gray-600">두 건물을 구분하여 층별 정보 제공</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">터치 인터페이스</h4>
              <p className="text-sm text-gray-600">직관적이고 쉬운 터치 조작</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🖼️</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">이미지 관리</h4>
              <p className="text-sm text-gray-600">각 공간별 사진 및 설명 제공</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
