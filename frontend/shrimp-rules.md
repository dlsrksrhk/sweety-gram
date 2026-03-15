# Sweety Gram Frontend - Development Guidelines

## 1. Project Overview

- **목적**: 사진 + 캡션 기반 SNS MVP 프론트엔드 (Instagram 유사)
- **스코프**: 프론트엔드(`/frontend`)만 작업. 백엔드(Spring Boot) 코드 수정 금지
- **기술 스택**: Next.js 16 (App Router) · React 19 · TypeScript 5 · TailwindCSS v4 · shadcn/ui · Zustand 5 · TanStack Query 5 · React Hook Form 7 · Zod 4

---

## 2. Directory Structure

```
src/
├── app/
│   ├── (auth)/                      # 비인증 전용 라우트 그룹
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (main)/                      # 인증 필요 라우트 그룹
│   │   ├── feed/page.tsx            # 홈 피드 (F002, F005, F015)
│   │   ├── explore/page.tsx         # 탐색 (F012)
│   │   ├── post/
│   │   │   ├── new/page.tsx         # 게시물 작성 (F001)
│   │   │   └── [id]/page.tsx        # 게시물 상세 (F003~F006)
│   │   ├── profile/
│   │   │   ├── page.tsx             # 내 프로필 (F009, F010, F011)
│   │   │   └── [username]/page.tsx  # 유저 프로필 (F007, F008, F011)
│   │   ├── follows/[username]/page.tsx  # 팔로우 목록 (F007, F011)
│   │   └── layout.tsx               # BottomNav + Header 포함
│   ├── layout.tsx                   # 루트 레이아웃 (QueryProvider, ThemeProvider)
│   ├── page.tsx                     # 랜딩 페이지 (F013, F014)
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn/ui 자동생성 컴포넌트 — 직접 수정 금지
│   ├── common/                      # Header, BottomNav, Avatar, PostCard 등 공통
│   ├── post/                        # PostForm, PostGrid, CommentList 등
│   ├── profile/                     # ProfileHeader, ProfileEditForm 등
│   └── feed/                        # FeedList, FeedItem 등
├── lib/
│   ├── api/                         # fetch 래퍼 함수 (엔드포인트별 파일)
│   ├── hooks/                       # TanStack Query 커스텀 훅 (use- 접두사)
│   ├── stores/                      # Zustand 스토어 (use-*-store.ts)
│   ├── schemas/                     # Zod 스키마 (폼 유효성 검사)
│   └── utils.ts                     # cn() 등 유틸리티
├── types/                           # TypeScript 인터페이스/타입 정의
└── middleware.ts                    # 인증 라우트 보호
```

### 규칙
- 페이지 파일은 반드시 `src/app/` 하위 App Router 구조로 생성
- 컴포넌트는 도메인별 폴더(`post/`, `profile/`, `feed/`, `common/`)에 배치
- `components/ui/`는 shadcn CLI로만 추가·관리, 직접 편집 금지
- 새 공통 컴포넌트는 `components/common/`에 추가

---

## 3. Routing Rules

### 라우트 보호
- `middleware.ts`에서 비인증 사용자의 `(main)` 그룹 접근을 `/login`으로 리디렉션
- 인증 사용자의 `(auth)` 그룹 접근은 `/feed`로 리디렉션
- 인증 토큰은 `httpOnly` 쿠키 또는 Zustand store에 저장 (결정 시 일관성 유지)

### URL 구조
| 페이지 | 경로 |
|--------|------|
| 랜딩 | `/` |
| 로그인 | `/login` |
| 회원가입 | `/register` |
| 홈 피드 | `/feed` |
| 탐색 | `/explore` |
| 게시물 작성 | `/post/new` |
| 게시물 상세 | `/post/[id]` |
| 내 프로필 | `/profile` |
| 유저 프로필 | `/profile/[username]` |
| 팔로우 목록 | `/follows/[username]` |

---

## 4. Component Rules

### Server vs Client Component
- **Server Component (기본)**: 정적 레이아웃, 메타데이터, 데이터 없는 구조 컴포넌트
- **Client Component (`'use client'` 필수)**: 이벤트 핸들러, useState/useEffect, Zustand, TanStack Query 사용 시
- 가능한 한 Server Component 유지, 상호작용이 필요한 최소 단위만 Client Component로 분리

### 컴포넌트 작성 규칙
- 파일명: PascalCase (`PostCard.tsx`, `ProfileHeader.tsx`)
- 컴포넌트 함수명: PascalCase, 파일명과 동일
- Props 타입은 `interface [ComponentName]Props` 로 정의
- 기본 내보내기(`export default`) 사용
- shadcn/ui 컴포넌트를 최대한 활용, 커스텀 UI 중복 작성 금지

### 이미지
- 반드시 `next/image`의 `<Image>` 컴포넌트 사용
- `<img>` 태그 직접 사용 금지

---

## 5. State Management Rules

### Zustand (클라이언트 전역 상태)
- **사용 대상**: 인증 정보(user, token), UI 상태(모달 열림 여부 등)
- 스토어 파일 위치: `src/lib/stores/`
- 파일명: `use-auth-store.ts`, `use-ui-store.ts` 형식
- 스토어 훅명: `useAuthStore`, `useUIStore` 형식

```ts
// ✅ 올바른 예
const { user, setUser } = useAuthStore()

// ❌ 금지: 서버 데이터를 Zustand에 저장
const { posts } = usePostStore() // 게시물 목록은 TanStack Query 사용
```

### TanStack Query (서버 상태)
- **사용 대상**: API 데이터 페칭, 캐싱, 무한 스크롤
- 커스텀 훅 위치: `src/lib/hooks/`
- 훅명: `use` + 동작 + 대상 (`useFeedPosts`, `usePostDetail`, `useToggleLike`)
- Query Key는 배열 형식, 계층적으로 정의: `['posts', 'feed']`, `['posts', id]`
- 무한 스크롤은 `useInfiniteQuery` 사용

```ts
// ✅ 올바른 예
export function useFeedPosts() {
  return useInfiniteQuery({
    queryKey: ['posts', 'feed'],
    queryFn: ({ pageParam }) => fetchFeedPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  })
}
```

---

## 6. API Integration Rules

- API 함수 위치: `src/lib/api/` (도메인별 파일: `posts.ts`, `auth.ts`, `users.ts`, `comments.ts`, `follows.ts`)
- Base URL: `process.env.NEXT_PUBLIC_API_URL` 환경변수 사용 (하드코딩 금지)
- 모든 API 함수는 async/await + fetch 사용
- 인증 토큰은 Authorization 헤더에 `Bearer {token}` 형식으로 전달
- API 에러는 throw하여 TanStack Query의 `error` 상태로 처리

```ts
// ✅ 올바른 예
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchFeedPosts(cursor?: string) {
  const res = await fetch(`${BASE_URL}/api/posts/feed?cursor=${cursor ?? ''}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) throw new Error('Failed to fetch feed')
  return res.json()
}

// ❌ 금지
const BASE_URL = 'http://localhost:8080' // 하드코딩 금지
```

---

## 7. Form & Validation Rules

- 모든 폼은 `react-hook-form` + `zod` 조합 사용
- Zod 스키마 위치: `src/lib/schemas/` (파일명: `auth-schema.ts`, `post-schema.ts`)
- `@hookform/resolvers/zod`의 `zodResolver` 사용

```ts
// ✅ 올바른 예 (src/lib/schemas/auth-schema.ts)
export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상입니다'),
})
export type LoginFormData = z.infer<typeof loginSchema>
```

---

## 8. Styling Rules

- 스타일은 **TailwindCSS v4 유틸리티 클래스만** 사용
- CSS 파일 직접 작성 금지 (`globals.css` 제외)
- 인라인 `style` 속성 사용 금지
- 클래스 조합은 `cn()` 유틸리티 사용 (`src/lib/utils.ts`의 `clsx` + `tailwind-merge` 조합)
- 다크모드: `next-themes` + TailwindCSS `dark:` 접두사 사용

```tsx
// ✅ 올바른 예
<div className={cn('flex items-center gap-2', isActive && 'text-primary')}>

// ❌ 금지
<div style={{ display: 'flex', gap: '8px' }}>
```

---

## 9. TypeScript Rules

- `any` 타입 사용 금지 — `unknown` 또는 명시적 타입 사용
- API 응답 타입은 `src/types/` 에 정의
- 타입 파일명: `post.ts`, `user.ts`, `comment.ts`, `follow.ts`
- `interface` 우선 사용, 유니온/교차 타입 필요 시 `type` 사용

```ts
// src/types/post.ts
export interface Post {
  id: string
  userId: string
  imageUrl: string
  caption: string
  createdAt: string
  likesCount: number
  commentsCount: number
}
```

---

## 10. Key File Interactions

| 작업 | 수정 필요 파일 |
|------|--------------|
| 새 페이지 추가 | `src/app/.../page.tsx` + 필요 시 `middleware.ts` 업데이트 |
| 새 API 엔드포인트 연동 | `src/lib/api/{domain}.ts` + `src/lib/hooks/use-{name}.ts` + `src/types/{domain}.ts` |
| 새 폼 추가 | `src/lib/schemas/{name}-schema.ts` + 폼 컴포넌트 |
| 새 shadcn 컴포넌트 추가 | `npx shadcn add {component}` CLI 실행 (직접 파일 생성 금지) |
| 전역 상태 추가 | `src/lib/stores/use-{name}-store.ts` 생성 |

---

## 11. PRD Feature Mapping

| Feature ID | 기능 | 구현 위치 |
|------------|------|----------|
| F001 | 게시물 작성 | `/post/new/page.tsx` |
| F002 | 홈 피드 조회 | `/feed/page.tsx` |
| F003 | 게시물 상세 조회 | `/post/[id]/page.tsx` |
| F004 | 게시물 수정/삭제 | `/post/[id]/page.tsx` |
| F005 | 좋아요 | `PostCard`, `PostDetail` 컴포넌트 |
| F006 | 댓글 작성/삭제 | `/post/[id]/page.tsx` |
| F007 | 팔로우/언팔로우 | `ProfileHeader` 컴포넌트 |
| F008 | 유저 프로필 조회 | `/profile/[username]/page.tsx` |
| F009 | 내 프로필 조회 | `/profile/page.tsx` |
| F010 | 내 프로필 수정 | `/profile/page.tsx` (인라인 폼) |
| F011 | 팔로워/팔로잉 목록 | `/follows/[username]/page.tsx` |
| F012 | 탐색 피드 | `/explore/page.tsx` |
| F013 | 회원가입 | `/register/page.tsx` |
| F014 | 로그인 | `/login/page.tsx` |
| F015 | 로그아웃 | `Header` 컴포넌트 |

---

## 12. Prohibited Actions

- **백엔드 코드 수정 금지** — 프론트엔드(`/frontend`) 디렉토리만 작업
- **`components/ui/` 직접 편집 금지** — shadcn CLI로만 관리
- **`any` 타입 사용 금지**
- **인라인 스타일(`style={}`) 사용 금지**
- **API URL 하드코딩 금지** — 반드시 `NEXT_PUBLIC_API_URL` 환경변수 사용
- **`<img>` 태그 직접 사용 금지** — `next/image` 사용
- **서버 데이터를 Zustand에 저장 금지** — TanStack Query 사용
- **MVP 이후 기능 구현 금지**: 스토리, 릴스, 해시태그 검색, 실시간 알림, DM, 북마크, 대댓글, 소셜 로그인, 계정 비공개
- **pages/ 라우터 사용 금지** — App Router만 사용
