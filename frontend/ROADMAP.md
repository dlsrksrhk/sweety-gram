# Sweety Gram 프론트엔드 로드맵

> 최종 업데이트: 2026-03-15
> 대상 팀: 프론트엔드 전담 팀
> MVP 목표 기간: 4주 (Sprint 1~4)

---

## 개요

### 프로젝트 요약

Sweety Gram은 사진과 짧은 글을 피드 형식으로 공유하고, 팔로우 기반으로 관심 있는 사람들의 콘텐츠를 소비하는 SNS 플랫폼이다. 프론트엔드는 Next.js 16 App Router 기반으로 구축하며, 백엔드(Spring Boot)가 제공하는 REST API를 소비한다.

### 프론트엔드 스코프 및 경계

- **담당**: UI 구현, 클라이언트 상태 관리, API 소비, 라우트 보호, 폼 유효성 검사
- **비담당**: 백엔드 API 서버, DB, 인증 토큰 발급, 이미지 스토리지
- **작업 디렉토리**: `/frontend` 하위만 수정 (백엔드 코드 수정 금지)

### 핵심 성공 기준

- F001~F015 기능 전체 동작 확인
- 무한 스크롤 홈 피드 및 탐색 피드 정상 작동
- 인증 라우트 보호 (비인증 접근 시 `/login` 리디렉션, 인증 후 `/feed` 리디렉션)
- 이미지 업로드 및 프리뷰 정상 동작
- 좋아요/팔로우 낙관적 업데이트(Optimistic Update) 구현

### 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI 라이브러리 | React 19 |
| 언어 | TypeScript 5 |
| 스타일링 | TailwindCSS v4 + shadcn/ui + Lucide React |
| 서버 상태 | TanStack Query 5 (`useInfiniteQuery` 포함) |
| 클라이언트 상태 | Zustand 5 (인증 정보, UI 상태) |
| 폼/검증 | React Hook Form 7 + Zod 4 |
| 알림 토스트 | Sonner |
| 테마 | next-themes (다크모드) |

---

## 타임라인 및 마일스톤

```
2026-03-16  Sprint 1 시작
            ├── 프로젝트 기반 세팅 완료
            └── 인증 흐름 (랜딩/로그인/회원가입) 완료

2026-03-23  Sprint 2 시작
            ├── 홈 피드 무한 스크롤 완료
            ├── 게시물 작성/상세 완료
            └── 좋아요 낙관적 업데이트 완료

2026-03-30  Sprint 3 시작
            ├── 내 프로필 / 유저 프로필 완료
            ├── 팔로우/언팔로우 완료
            └── 댓글 작성/삭제 완료

2026-04-06  Sprint 4 시작
            ├── 탐색 피드 (그리드) 완료
            ├── QA / 버그 수정 완료
            └── 배포 준비 완료

2026-04-11  MVP 출시 목표
```

---

## 백엔드 협업 접점

> 백엔드 팀(Spring Boot)과 사전 합의가 필요한 항목을 명시한다.
> 합의 전에는 Mock Service Worker(MSW) 또는 로컬 목 함수로 대체 개발한다.

### 합의 필요 API 엔드포인트

| 도메인 | 메서드 | 경로 (예시) | 비고 |
|--------|--------|------------|------|
| 인증 | POST | `/api/auth/register` | username, email, password |
| 인증 | POST | `/api/auth/login` | 응답에 JWT 토큰 포함 |
| 인증 | POST | `/api/auth/logout` | 세션 무효화 |
| 게시물 | POST | `/api/posts` | multipart/form-data (image + caption) |
| 게시물 | GET | `/api/posts/feed?cursor=` | 팔로우 피드, 커서 기반 페이지네이션 |
| 게시물 | GET | `/api/posts/explore?cursor=` | 전체 공개 게시물 |
| 게시물 | GET | `/api/posts/{id}` | 단건 상세 |
| 게시물 | PATCH | `/api/posts/{id}` | 캡션 수정 (본인만) |
| 게시물 | DELETE | `/api/posts/{id}` | 삭제 (본인만) |
| 좋아요 | POST | `/api/posts/{id}/likes` | 좋아요 등록 |
| 좋아요 | DELETE | `/api/posts/{id}/likes` | 좋아요 취소 |
| 댓글 | GET | `/api/posts/{id}/comments` | 댓글 목록 |
| 댓글 | POST | `/api/posts/{id}/comments` | 댓글 작성 |
| 댓글 | DELETE | `/api/comments/{id}` | 댓글 삭제 (본인만) |
| 팔로우 | POST | `/api/follows/{username}` | 팔로우 |
| 팔로우 | DELETE | `/api/follows/{username}` | 언팔로우 |
| 팔로우 | GET | `/api/users/{username}/followers` | 팔로워 목록 |
| 팔로우 | GET | `/api/users/{username}/following` | 팔로잉 목록 |
| 프로필 | GET | `/api/users/{username}` | 유저 프로필 조회 |
| 프로필 | GET | `/api/users/me` | 내 프로필 조회 |
| 프로필 | PATCH | `/api/users/me` | 프로필 수정 (multipart: avatar + bio + name) |
| 게시물 목록 | GET | `/api/users/{username}/posts` | 유저별 게시물 그리드 |

### 데이터 스키마 합의 필요 항목

- **페이지네이션 방식**: 커서 기반(`cursor`, `nextCursor`) 또는 오프셋 기반 — 프론트엔드는 `useInfiniteQuery` + 커서 방식으로 구현 예정이므로 백엔드와 사전 확정 필요
- **인증 토큰 전달 방식**: `httpOnly` 쿠키 vs `Authorization: Bearer` 헤더 — 결정에 따라 `middleware.ts` 구현 방식이 달라짐
- **이미지 URL**: 백엔드가 S3/CDN URL을 응답에 포함하는지, 또는 프론트엔드가 presigned URL을 직접 받는지 확인 필요
- **에러 응답 포맷**: `{ message: string, code: string }` 형식 통일 필요

### 목(Mock) 개발 전략

```
백엔드 API 미완성 구간 → src/lib/api/ 내 목 함수로 대체
예시:
  fetchFeedPosts() → 하드코딩된 더미 Post[] 배열 반환
  login() → { token: 'mock-token', user: { ... } } 반환

목 제거 기준: 실제 API 엔드포인트 배포 확인 후 환경변수 NEXT_PUBLIC_API_URL 전환
```

---

## 스프린트별 상세 계획

---

### Sprint 1 (1주차, 03-16 ~ 03-22): 프로젝트 초기 세팅 + 인증

**목표**: 개발 환경 기반을 완성하고 인증 흐름(랜딩, 로그인, 회원가입)을 E2E로 동작시킨다.

**Sprint 1 완료 기준 (Definition of Done)**
- [ ] 로컬에서 `npm run dev` 실행 시 랜딩 페이지 렌더링 확인
- [ ] 회원가입 → 자동 로그인 → `/feed` 리디렉션 동작
- [ ] 로그인 → `/feed` 리디렉션 동작
- [ ] 비인증 상태에서 `/feed` 접근 시 `/login` 리디렉션 동작
- [ ] 폼 유효성 에러 메시지 표시 확인
- [ ] `useAuthStore`에 사용자 정보 정상 저장 확인

#### 1-1. 프로젝트 기반 세팅

**담당**: 프론트엔드 리드

| # | 작업 | 유형 | 예상 소요 |
|---|------|------|-----------|
| 1 | `src/` 디렉토리 구조 생성: `app/`, `components/`, `lib/`, `types/` 하위 폴더 일괄 생성 | 프론트엔드 | 0.5일 |
| 2 | `src/lib/utils.ts` 작성 — `clsx` + `tailwind-merge` 기반 `cn()` 유틸리티 | 프론트엔드 | 0.5일 |
| 3 | `src/app/layout.tsx` 작성 — `QueryClientProvider`, `ThemeProvider` 래퍼 구성 | 프론트엔드 | 0.5일 |
| 4 | `src/app/globals.css` TailwindCSS v4 기본 설정 확인 및 CSS 변수 정의 | 프론트엔드 | 0.5일 |
| 5 | `.env.local` 파일 생성 — `NEXT_PUBLIC_API_URL` 환경변수 설정 (로컬 Spring Boot URL) | 프론트엔드 | 0.5일 |
| 6 | shadcn/ui 초기화 확인 (`components.json`) 및 필수 컴포넌트 설치: `button`, `input`, `form`, `avatar`, `card`, `toast`, `dialog`, `tabs` | 프론트엔드 | 1일 |
| 7 | `src/middleware.ts` 작성 — `(main)` 그룹 비인증 접근 차단 및 `(auth)` 그룹 인증 사용자 리디렉션 로직 | 프론트엔드 | 1일 |
| 8 | `src/types/user.ts`, `post.ts`, `comment.ts`, `follow.ts` 타입 정의 파일 생성 | 프론트엔드 | 1일 |

#### 1-2. 인증 기반 (F013, F014, F015)

**담당**: 프론트엔드 개발자

| # | 작업 | 유형 | 연관 기능 | 예상 소요 |
|---|------|------|-----------|-----------|
| 9 | `src/lib/stores/use-auth-store.ts` 작성 — `user`, `token`, `setUser`, `setToken`, `logout` 상태 정의 | 프론트엔드 | 0.5일 |
| 10 | `src/lib/schemas/auth-schema.ts` 작성 — `loginSchema`, `registerSchema` Zod 스키마 정의 | 프론트엔드 | 0.5일 |
| 11 | `src/lib/api/auth.ts` 작성 — `login()`, `register()`, `logout()` fetch 함수 (API 미완성 시 목 응답 반환) | API 의존 | F014, F013 | 1일 |
| 12 | `src/app/page.tsx` (랜딩) 작성 — 서비스 슬로건, 대표 이미지, 로그인/회원가입 버튼 배치 | 프론트엔드 | 1일 |
| 13 | `src/app/(auth)/layout.tsx` 작성 — 인증 페이지 공통 레이아웃 (중앙 정렬 카드 스타일) | 프론트엔드 | 0.5일 |
| 14 | `src/app/(auth)/login/page.tsx` 작성 — `LoginForm` 컴포넌트 포함, 이메일/비밀번호 입력, 에러 메시지, 회원가입 링크 | 프론트엔드 | 1일 |
| 15 | `src/app/(auth)/register/page.tsx` 작성 — `RegisterForm` 컴포넌트 포함, username/email/password 입력, 실시간 유효성 에러, 로그인 링크 | 프론트엔드 | 1일 |
| 16 | `src/lib/hooks/use-auth.ts` 작성 — `useLogin()`, `useRegister()`, `useLogout()` TanStack Query mutation 훅 | API 의존 | F013, F014, F015 | 1일 |
| 17 | 로그인/회원가입 성공 시 `useAuthStore` 업데이트 및 `/feed` 리디렉션 로직 구현 | 프론트엔드 | 0.5일 |

#### Sprint 1 검증

> **Mock 전환**: `.env.local`에서 `NEXT_PUBLIC_USE_MOCK=true` 설정 후 `npm run dev`

| # | 검증 항목 | Mock 방법 | 기대 결과 |
|---|-----------|-----------|-----------|
| V1 | 랜딩 페이지 렌더링 | Mock 불필요 | `/` 접속 시 슬로건 + 로그인/회원가입 버튼 표시 |
| V2 | 비인증 라우트 보호 | Mock 불필요 | `/feed` 직접 접속 시 `/login` 리디렉션 |
| V3 | 인증 후 auth 접근 차단 | 로그인 완료 후 | `/login` 직접 접속 시 `/feed` 리디렉션 |
| V4 | 로그인 폼 유효성 | Mock 불필요 | 잘못된 이메일 형식 → 에러, 7자 비밀번호 → "최소 8자" 에러 |
| V5 | 회원가입 실시간 유효성 | Mock 불필요 | username 타이핑 중 regex 에러 즉시 표시 |
| V6 | 비밀번호 토글 | Mock 불필요 | 눈 아이콘 클릭 시 text/password 전환 |
| V7 | 로그인 성공 흐름 | `test@example.com` / `password123` | `/feed` 리디렉션, localStorage `auth-storage`에 user/token 저장 확인 (DevTools → Application) |
| V8 | 로그인 실패 처리 | 다른 이메일/비밀번호 입력 | 폼 하단 에러 메시지 표시, 리디렉션 없음 |
| V9 | 회원가입 성공 흐름 | username `newuser` 입력 | `/feed` 리디렉션, `useAuthStore` 저장 확인 |
| V10 | 회원가입 서버 에러 처리 | username `taken` 입력 | "이미 사용 중인 사용자명" 에러 메시지 표시 |
| V11 | 빌드 에러 0건 | Mock 불필요 | `npm run build` 성공 |

> **Mock 계정** (`src/lib/api/auth.mock.ts`):
> - 로그인 성공: `test@example.com` / `password123`
> - 회원가입 실패 트리거: username = `taken`
> - Mock 파일은 백엔드 연동 후 삭제, `NEXT_PUBLIC_USE_MOCK` 환경변수 제거

---

### Sprint 2 (2주차, 03-23 ~ 03-29): 핵심 피드 기능

**목표**: 홈 피드의 무한 스크롤, 게시물 작성/상세, 좋아요 기능을 구현한다.

**Sprint 2 완료 기준 (Definition of Done)**
- [ ] 홈 피드 무한 스크롤로 게시물 카드 렌더링 확인
- [ ] 팔로우 없는 신규 사용자에게 탐색 페이지 유도 안내 표시
- [ ] 이미지 + 캡션 게시물 작성 후 피드 반영 확인
- [ ] 게시물 상세 페이지에서 캡션 수정 / 삭제 동작 확인
- [ ] 좋아요 토글 시 UI 즉시 반영 (낙관적 업데이트)

#### 2-1. 공통 레이아웃 컴포넌트 (인증 그룹)

| # | 작업 | 유형 | 예상 소요 |
|---|------|------|-----------|
| 18 | `src/app/(main)/layout.tsx` 작성 — `Header` + `BottomNav` 포함 레이아웃 | 프론트엔드 | 0.5일 |
| 19 | `src/components/common/Header.tsx` 작성 — 로고(홈 이동), 게시물 작성 아이콘, 로그아웃 버튼 | 프론트엔드 | 1일 |
| 20 | `src/components/common/BottomNav.tsx` 작성 — 홈/탐색/내프로필 탭, 현재 활성 탭 시각적 표시 | 프론트엔드 | 1일 |
| 21 | `src/components/common/Avatar.tsx` 작성 — `next/image` 기반, 크기 variant (sm/md/lg) 지원 | 프론트엔드 | 0.5일 |

#### 2-2. 홈 피드 (F002, F005)

| # | 작업 | 유형 | 연관 기능 | 예상 소요 |
|---|------|------|-----------|-----------|
| 22 | `src/lib/api/posts.ts` 작성 — `fetchFeedPosts(cursor?)` 함수 (API 미완성 시 목 데이터 반환) | API 의존 | F002 | 0.5일 |
| 23 | `src/lib/hooks/use-feed-posts.ts` 작성 — `useFeedPosts()` `useInfiniteQuery` 훅, `queryKey: ['posts', 'feed']` | 프론트엔드 | 1일 |
| 24 | `src/components/feed/FeedItem.tsx` 작성 — 아바타, 이미지(`next/image`), 캡션 미리보기, 좋아요/댓글 수 표시 | 프론트엔드 | 1일 |
| 25 | `src/components/feed/FeedList.tsx` 작성 — `useFeedPosts` 소비, Intersection Observer 기반 무한 스크롤, 로딩/에러 상태 처리 | 프론트엔드 | 1.5일 |
| 26 | `src/app/(main)/feed/page.tsx` 작성 — `FeedList` 렌더링, 빈 피드 시 탐색 페이지 유도 안내 UI | 프론트엔드 | 0.5일 |
| 27 | `src/lib/api/posts.ts`에 `toggleLike(postId)` 함수 추가 | API 의존 | F005 | 0.5일 |
| 28 | `src/lib/hooks/use-toggle-like.ts` 작성 — `useToggleLike()` mutation 훅, 낙관적 업데이트(`onMutate`) 구현, `queryKey: ['posts', 'feed']` invalidation | 프론트엔드 | 1일 |
| 29 | `src/components/feed/LikeButton.tsx` 작성 — 하트 아이콘 토글, 좋아요 수 표시, 로딩 중 비활성화 처리 | 프론트엔드 | 0.5일 |

#### 2-3. 게시물 작성 (F001)

| # | 작업 | 유형 | 연관 기능 | 예상 소요 |
|---|------|------|-----------|-----------|
| 30 | `src/lib/schemas/post-schema.ts` 작성 — `createPostSchema` (caption 최대 2,200자, image 필수) | 프론트엔드 | 0.5일 |
| 31 | `src/lib/api/posts.ts`에 `createPost(formData: FormData)` 함수 추가 | API 의존 | F001 | 0.5일 |
| 32 | `src/components/post/PostForm.tsx` 작성 — 이미지 업로드(드래그&드롭/파일 선택, JPG/PNG/WEBP), 이미지 미리보기(`next/image`), 캡션 입력, 이미지 미선택 시 공유 버튼 비활성화 | 프론트엔드 | 2일 |
| 33 | `src/lib/hooks/use-create-post.ts` 작성 — `useCreatePost()` mutation 훅, 성공 시 `['posts', 'feed']` invalidation 및 `/feed` 리디렉션 | 프론트엔드 | 0.5일 |
| 34 | `src/app/(main)/post/new/page.tsx` 작성 — `PostForm` 렌더링, 취소 버튼 → `/feed` 이동 | 프론트엔드 | 0.5일 |

#### 2-4. 게시물 상세 (F003, F004, F005)

| # | 작업 | 유형 | 연관 기능 | 예상 소요 |
|---|------|------|-----------|-----------|
| 35 | `src/lib/api/posts.ts`에 `fetchPostDetail(id)`, `updatePost(id, caption)`, `deletePost(id)` 함수 추가 | API 의존 | F003, F004 | 0.5일 |
| 36 | `src/lib/hooks/use-post-detail.ts` 작성 — `usePostDetail(id)` `useQuery` 훅, `queryKey: ['posts', id]` | 프론트엔드 | 0.5일 |
| 37 | `src/lib/hooks/use-update-post.ts` 작성 — `useUpdatePost()` mutation 훅, 성공 시 `['posts', id]` invalidation | 프론트엔드 | 0.5일 |
| 38 | `src/lib/hooks/use-delete-post.ts` 작성 — `useDeletePost()` mutation 훅, 성공 시 `/feed` 리디렉션 및 피드 캐시 invalidation | 프론트엔드 | 0.5일 |
| 39 | `src/components/post/PostDetail.tsx` 작성 — 이미지 전체 표시, 작성자 정보, 좋아요 버튼, 본인 게시물일 때 수정/삭제 버튼 표시 | 프론트엔드 | 1.5일 |
| 40 | `src/components/post/CaptionEditForm.tsx` 작성 — 인라인 캡션 수정 폼, Zod 유효성, 저장/취소 버튼 | 프론트엔드 | 1일 |
| 41 | `src/app/(main)/post/[id]/page.tsx` 작성 — `PostDetail` + 댓글 영역 통합 렌더링 | 프론트엔드 | 0.5일 |

#### Sprint 2 검증

> **Mock 전환**: `src/lib/api/posts.mock.ts` 작성 후 `NEXT_PUBLIC_USE_MOCK=true` 유지

| # | 검증 항목 | Mock 방법 | 기대 결과 |
|---|-----------|-----------|-----------|
| V12 | 홈 피드 초기 로딩 | `fetchFeedPosts()` → 더미 Post 15개 반환 | 피드 카드 목록 렌더링, 스켈레톤 UI 표시 후 전환 |
| V13 | 무한 스크롤 | 2페이지 후 `nextCursor: undefined` 반환 | 스크롤 하단 도달 시 추가 로딩, 2페이지 이후 로딩 없음 |
| V14 | 빈 피드 안내 | `fetchFeedPosts()` → 빈 배열 반환 | "탐색 페이지에서 새로운 사람들을 만나보세요" 안내 표시 |
| V15 | 좋아요 낙관적 업데이트 | `toggleLike()` → 500ms 지연 후 성공 반환 | 클릭 즉시 하트 아이콘 및 카운트 변경, API 완료 후 유지 |
| V16 | 좋아요 낙관적 롤백 | `toggleLike()` → throw Error | 클릭 즉시 변경 → 에러 시 이전 상태 복원 |
| V17 | 게시물 작성 | `createPost()` → 더미 Post 반환 | 이미지 미선택 시 공유 버튼 비활성화, 성공 시 `/feed` 이동 |
| V18 | 이미지 미리보기 | Mock 불필요 | JPG/PNG/WEBP 선택 시 미리보기 표시, 다른 형식 선택 불가 |
| V19 | 게시물 상세 조회 | `fetchPostDetail(id)` → 더미 Post 반환 | 이미지, 캡션, 좋아요/댓글 수 표시 |
| V20 | 캡션 수정 | `updatePost()` → 수정된 Post 반환 | 본인 게시물에만 수정 버튼 표시, 저장 후 캡션 갱신 |
| V21 | 게시물 삭제 | `deletePost()` → void 반환 | 삭제 확인 다이얼로그 표시, 확인 시 `/feed` 이동 |
| V22 | 빌드 에러 0건 | Mock 불필요 | `npm run build` 성공 |

> **Mock 파일 위치**: `src/lib/api/posts.mock.ts` — 더미 Post 배열, 페이지당 15개, 2페이지 후 종료

---

### Sprint 3 (3주차, 03-30 ~ 04-05): 소셜 기능

**목표**: 프로필 조회/수정, 팔로우/언팔로우, 댓글 기능을 완성한다.

**Sprint 3 완료 기준 (Definition of Done)**
- [ ] 내 프로필 페이지에서 사진/이름/소개 수정 후 저장 동작 확인
- [ ] 유저 프로필 페이지에서 팔로우/언팔로우 토글 UI 반영 확인
- [ ] 팔로워/팔로잉 목록 페이지 탭 전환 동작 확인
- [ ] 게시물 상세에서 댓글 작성/삭제 동작 확인

#### 3-1. 댓글 (F006)

| # | 작업 | 유형 | 연관 기능 | 예상 소요 |
|---|------|------|-----------|-----------|
| 42 | `src/lib/schemas/comment-schema.ts` 작성 — `createCommentSchema` (content 필수, 최소 1자) | 프론트엔드 | 0.5일 |
| 43 | `src/lib/api/comments.ts` 작성 — `fetchComments(postId)`, `createComment(postId, content)`, `deleteComment(commentId)` 함수 | API 의존 | F006 | 0.5일 |
| 44 | `src/lib/hooks/use-comments.ts` 작성 — `useComments(postId)` `useQuery` 훅, `queryKey: ['comments', postId]` | 프론트엔드 | 0.5일 |
| 45 | `src/lib/hooks/use-create-comment.ts` 작성 — `useCreateComment()` mutation 훅, 성공 시 `['comments', postId]` invalidation | 프론트엔드 | 0.5일 |
| 46 | `src/lib/hooks/use-delete-comment.ts` 작성 — `useDeleteComment()` mutation 훅 | 프론트엔드 | 0.5일 |
| 47 | `src/components/post/CommentList.tsx` 작성 — 댓글 목록 렌더링, 본인 댓글에 삭제 버튼 표시 | 프론트엔드 | 1일 |
| 48 | `src/components/post/CommentInput.tsx` 작성 — 댓글 입력 필드 + 작성 버튼, React Hook Form 연동 | 프론트엔드 | 0.5일 |
| 49 | `src/app/(main)/post/[id]/page.tsx` 업데이트 — `CommentList`, `CommentInput` 컴포넌트 통합 | 프론트엔드 | 0.5일 |

#### 3-2. 프로필 — 내 프로필 (F009, F010, F011)

| # | 작업 | 유형 | 연관 기능 | 예상 소요 |
|---|------|------|-----------|-----------|
| 50 | `src/lib/api/users.ts` 작성 — `fetchMyProfile()`, `updateMyProfile(formData)` 함수 | API 의존 | F009, F010 | 0.5일 |
| 51 | `src/lib/hooks/use-my-profile.ts` 작성 — `useMyProfile()` `useQuery` 훅, `queryKey: ['users', 'me']` | 프론트엔드 | 0.5일 |
| 52 | `src/lib/hooks/use-update-profile.ts` 작성 — `useUpdateProfile()` mutation 훅, 성공 시 `['users', 'me']` invalidation | 프론트엔드 | 0.5일 |
| 53 | `src/lib/schemas/profile-schema.ts` 작성 — `updateProfileSchema` (bio 최대 150자 등) | 프론트엔드 | 0.5일 |
| 54 | `src/components/profile/ProfileHeader.tsx` 작성 — 아바타, username, bio, 게시물수/팔로워수/팔로잉수, 팔로우 목록 이동 링크 | 프론트엔드 | 1.5일 |
| 55 | `src/components/profile/ProfileEditForm.tsx` 작성 — 인라인 수정 폼, 아바타 이미지 변경(`next/image`), 이름/소개 입력, 저장/취소 버튼 | 프론트엔드 | 1.5일 |
| 56 | `src/components/post/PostGrid.tsx` 작성 — 3열 그리드 게시물 썸네일 목록 (공통 사용: 내/유저 프로필 페이지) | 프론트엔드 | 1일 |
| 57 | `src/app/(main)/profile/page.tsx` 작성 — `ProfileHeader` (수정 버튼 포함) + `PostGrid` + `ProfileEditForm` 조합 | 프론트엔드 | 1일 |

#### 3-3. 프로필 — 유저 프로필 (F007, F008, F011)

| # | 작업 | 유형 | 연관 기능 | 예상 소요 |
|---|------|------|-----------|-----------|
| 58 | `src/lib/api/users.ts`에 `fetchUserProfile(username)`, `fetchUserPosts(username)` 함수 추가 | API 의존 | F008 | 0.5일 |
| 59 | `src/lib/hooks/use-user-profile.ts` 작성 — `useUserProfile(username)` `useQuery` 훅, `queryKey: ['users', username]` | 프론트엔드 | 0.5일 |
| 60 | `src/lib/api/follows.ts` 작성 — `followUser(username)`, `unfollowUser(username)` 함수 | API 의존 | F007 | 0.5일 |
| 61 | `src/lib/hooks/use-toggle-follow.ts` 작성 — `useToggleFollow()` mutation 훅, 팔로우 상태 낙관적 업데이트, `['users', username]` invalidation | 프론트엔드 | 1일 |
| 62 | `src/components/profile/FollowButton.tsx` 작성 — 팔로우/언팔로우 토글 버튼, 로딩 상태 처리 | 프론트엔드 | 0.5일 |
| 63 | `src/app/(main)/profile/[username]/page.tsx` 작성 — `ProfileHeader` (팔로우 버튼 포함) + `PostGrid` 렌더링, 본인 접근 시 `/profile`로 리디렉션 | 프론트엔드 | 1일 |

#### 3-4. 팔로우 목록 (F011)

| # | 작업 | 유형 | 연관 기능 | 예상 소요 |
|---|------|------|-----------|-----------|
| 64 | `src/lib/api/follows.ts`에 `fetchFollowers(username)`, `fetchFollowing(username)` 함수 추가 | API 의존 | F011 | 0.5일 |
| 65 | `src/lib/hooks/use-follow-list.ts` 작성 — `useFollowers(username)`, `useFollowing(username)` `useQuery` 훅 | 프론트엔드 | 0.5일 |
| 66 | `src/components/profile/FollowListItem.tsx` 작성 — 아바타, username, bio, 팔로우/언팔로우 버튼 | 프론트엔드 | 0.5일 |
| 67 | `src/app/(main)/follows/[username]/page.tsx` 작성 — 팔로워/팔로잉 탭(`shadcn/ui Tabs`), `FollowListItem` 목록, 사용자 클릭 시 유저 프로필 이동 | 프론트엔드 | 1일 |

#### Sprint 3 검증

> **Mock 전환**: `src/lib/api/comments.mock.ts`, `users.mock.ts`, `follows.mock.ts` 작성 후 `NEXT_PUBLIC_USE_MOCK=true` 유지

| # | 검증 항목 | Mock 방법 | 기대 결과 |
|---|-----------|-----------|-----------|
| V23 | 댓글 목록 조회 | `fetchComments()` → 더미 Comment 5개 반환 | 게시물 상세에서 댓글 목록 표시 |
| V24 | 댓글 작성 | `createComment()` → 더미 Comment 반환 | 입력 후 작성 버튼 클릭 시 목록 갱신, 입력 필드 초기화 |
| V25 | 빈 댓글 작성 방지 | Mock 불필요 | 빈 입력 시 작성 버튼 비활성화 |
| V26 | 댓글 삭제 | `deleteComment()` → void 반환 | 본인 댓글에만 삭제 버튼 표시, 삭제 후 목록 즉시 갱신 |
| V27 | 내 프로필 조회 | `fetchMyProfile()` → 더미 User 반환 | 아바타, username, bio, 통계 표시, 수정 버튼 표시 |
| V28 | 프로필 수정 | `updateMyProfile()` → 수정된 User 반환 | 이름/소개 변경 후 저장 시 프로필 갱신, 아바타 미리보기 |
| V29 | 유저 프로필 조회 | `fetchUserProfile(username)` → 더미 User 반환 | 팔로우 버튼 표시, 게시물 그리드 렌더링 |
| V30 | 팔로우 낙관적 업데이트 | `followUser()` → 500ms 지연 후 성공 | 버튼 즉시 "팔로잉"으로 변경, 팔로워 수 즉시 증가 |
| V31 | 언팔로우 낙관적 롤백 | `unfollowUser()` → throw Error | 버튼 즉시 변경 → 에러 시 이전 상태 복원 |
| V32 | 팔로워/팔로잉 탭 전환 | `fetchFollowers/Following()` → 더미 User 목록 반환 | 탭 클릭 시 해당 목록으로 전환 |
| V33 | 본인 프로필 리디렉션 | Mock 불필요 | `/profile/testuser` 접속 시 `/profile` 리디렉션 |
| V34 | 빌드 에러 0건 | Mock 불필요 | `npm run build` 성공 |

> **Mock 파일 위치**: `src/lib/api/comments.mock.ts`, `src/lib/api/users.mock.ts`, `src/lib/api/follows.mock.ts`

---

### Sprint 4 (4주차, 04-06 ~ 04-11): 탐색 피드 + QA + 배포 준비

**목표**: 탐색 피드를 완성하고 전체 기능 QA 및 배포 준비를 마친다.

**Sprint 4 완료 기준 (Definition of Done)**
- [ ] 탐색 피드 3열 그리드 무한 스크롤 동작 확인
- [ ] 썸네일 위 좋아요수/댓글수 오버레이 표시 확인
- [ ] 전체 사용자 여정(랜딩 → 회원가입 → 피드 → 게시물 작성 → 상세 → 프로필 → 탐색) E2E 확인
- [ ] Lighthouse Performance 점수 80점 이상
- [ ] 배포 환경 환경변수 설정 문서화 완료

#### 4-1. 탐색 피드 (F012)

| # | 작업 | 유형 | 연관 기능 | 예상 소요 |
|---|------|------|-----------|-----------|
| 68 | `src/lib/api/posts.ts`에 `fetchExplorePosts(cursor?)` 함수 추가 | API 의존 | F012 | 0.5일 |
| 69 | `src/lib/hooks/use-explore-posts.ts` 작성 — `useExplorePosts()` `useInfiniteQuery` 훅, `queryKey: ['posts', 'explore']` | 프론트엔드 | 0.5일 |
| 70 | `src/components/post/ExploreGrid.tsx` 작성 — 3열 그리드 무한 스크롤, 썸네일 위 좋아요수/댓글수 오버레이(`group-hover` 방식) | 프론트엔드 | 1.5일 |
| 71 | `src/app/(main)/explore/page.tsx` 작성 — `ExploreGrid` 렌더링 | 프론트엔드 | 0.5일 |

#### 4-2. QA 및 버그 수정

| # | 작업 | 유형 | 예상 소요 |
|---|------|------|-----------|
| 72 | 전체 사용자 여정 E2E 시나리오 수동 테스트 수행 (랜딩~탐색 전 경로) | 프론트엔드 | 1일 |
| 73 | 모바일 뷰포트(375px, 390px) 반응형 레이아웃 검증 — BottomNav, PostGrid, PostDetail 등 | 프론트엔드 | 1일 |
| 74 | API 에러 상태 처리 점검 — 401 인증 만료 시 로그인 리디렉션, 404/500 에러 페이지 표시 | 프론트엔드 | 1일 |
| 75 | Sonner 토스트 알림 연동 확인 — 게시물 작성 성공/실패, 프로필 수정 성공, 로그아웃 등 | 프론트엔드 | 0.5일 |
| 76 | `next/image` `sizes` 속성 최적화 — 피드 카드, 프로필 아바타, 그리드 썸네일 | 프론트엔드 | 0.5일 |
| 77 | 접근성 점검 — 폼 레이블, 버튼 `aria-label`, 이미지 `alt` 속성 | 프론트엔드 | 1일 |
| 78 | `TypeScript` strict 모드 에러 0건 확인 및 `any` 타입 잔존 여부 점검 | 프론트엔드 | 0.5일 |

#### 4-3. 배포 준비

| # | 작업 | 유형 | 예상 소요 |
|---|------|------|-----------|
| 79 | `next.config.ts` `images.domains` 또는 `remotePatterns` 설정 — 백엔드 이미지 CDN 도메인 추가 | 공동 작업 | 0.5일 |
| 80 | `.env.production` 환경변수 문서화 — `NEXT_PUBLIC_API_URL` 프로덕션 값 설정 가이드 작성 | 프론트엔드 | 0.5일 |
| 81 | `npm run build` 빌드 에러 0건 확인 및 번들 크기 점검 | 프론트엔드 | 0.5일 |
| 82 | 배포 플랫폼(Vercel/Docker 등) 결정 후 배포 파이프라인 구성 | 공동 작업 | 1일 |

#### Sprint 4 검증

> **실제 API 전환**: `.env.local`에서 `NEXT_PUBLIC_USE_MOCK=false` 설정, 백엔드 서버 실행 필요

| # | 검증 항목 | Mock/Real | 기대 결과 |
|---|-----------|-----------|-----------|
| V35 | 탐색 피드 그리드 | `fetchExplorePosts()` → 더미 Post 30개, 3페이지 후 종료 | 3열 그리드 표시, 무한 스크롤 동작 |
| V36 | 썸네일 호버 오버레이 | Mock 불필요 | 썸네일 위 마우스 오버 시 좋아요수/댓글수 표시 |
| V37 | 탐색 → 게시물 상세 이동 | Mock 불필요 | 썸네일 클릭 시 `/post/[id]` 이동 |
| V38 | 전체 E2E 흐름 (Mock) | 모든 Mock 활성화 | 랜딩 → 회원가입 → 피드 → 게시물 작성 → 상세 → 프로필 → 탐색 전 경로 정상 동작 |
| V39 | 전체 E2E 흐름 (Real API) | `NEXT_PUBLIC_USE_MOCK=false` | 실제 백엔드와 동일 흐름 검증 |
| V40 | 모바일 반응형 (375px) | Mock 불필요 | Chrome DevTools 모바일 뷰에서 BottomNav, PostGrid, PostDetail 레이아웃 확인 |
| V41 | 401 에러 처리 | Real API 또는 Mock에서 401 throw | 자동 `/login` 리디렉션 |
| V42 | Lighthouse Performance | Mock 불필요 | Chrome DevTools Lighthouse 점수 80점 이상 |
| V43 | TypeScript strict 에러 0건 | Mock 불필요 | `npx tsc --noEmit` 에러 없음 |
| V44 | 최종 빌드 | `NEXT_PUBLIC_USE_MOCK=false` | `npm run build` 성공, 번들 크기 이상 없음 |

> **Mock → Real 전환 체크리스트**:
> - [ ] `.env.local` `NEXT_PUBLIC_USE_MOCK=false`
> - [ ] `NEXT_PUBLIC_API_URL` 프로덕션 URL로 변경
> - [ ] `src/lib/api/*.mock.ts` 파일 전체 삭제
> - [ ] `src/lib/hooks/use-auth.ts` mock 분기 코드 제거 → `import`를 `auth.ts`로 단일화

---

## 기능별 상세 명세

### F001 — 게시물 작성

- **우선순위**: P0
- **사용자 스토리**: 로그인한 사용자로서, 이미지와 캡션을 입력하여 게시물을 공유하고 싶다.
- **관련 파일**:
  - `src/app/(main)/post/new/page.tsx`
  - `src/components/post/PostForm.tsx`
  - `src/lib/api/posts.ts` — `createPost()`
  - `src/lib/hooks/use-create-post.ts`
  - `src/lib/schemas/post-schema.ts`
- **API 의존**: `POST /api/posts` (multipart/form-data)
- **목 전략**: 성공 응답 더미 Post 객체 반환, 500ms 지연 시뮬레이션
- **수용 기준**:
  - [ ] JPG/PNG/WEBP 이미지만 업로드 허용
  - [ ] 이미지 선택 전 공유 버튼 비활성화
  - [ ] 캡션 2,200자 초과 시 에러 표시
  - [ ] 업로드 중 로딩 스피너 표시
  - [ ] 성공 시 홈 피드로 이동 + 피드 캐시 갱신

### F002 — 홈 피드 조회

- **우선순위**: P0
- **사용자 스토리**: 로그인한 사용자로서, 팔로우한 계정의 최신 게시물을 한눈에 보고 싶다.
- **관련 파일**:
  - `src/app/(main)/feed/page.tsx`
  - `src/components/feed/FeedList.tsx`
  - `src/components/feed/FeedItem.tsx`
  - `src/lib/hooks/use-feed-posts.ts`
  - `src/lib/api/posts.ts` — `fetchFeedPosts()`
- **API 의존**: `GET /api/posts/feed?cursor=` (커서 기반 페이지네이션)
- **목 전략**: 더미 Post[] 배열 (15개), 2페이지 후 `nextCursor: undefined` 반환
- **수용 기준**:
  - [ ] 최초 진입 시 최신 게시물 자동 로딩
  - [ ] 스크롤 하단 도달 시 다음 페이지 자동 로딩
  - [ ] 팔로우 없을 시 "탐색 페이지에서 새로운 사람들을 만나보세요" 안내 표시
  - [ ] 로딩 중 스켈레톤 UI 표시

### F003 — 게시물 상세 조회

- **우선순위**: P0
- **사용자 스토리**: 피드에서 게시물을 클릭하면 이미지, 캡션, 댓글을 한 화면에서 보고 싶다.
- **관련 파일**:
  - `src/app/(main)/post/[id]/page.tsx`
  - `src/components/post/PostDetail.tsx`
  - `src/lib/hooks/use-post-detail.ts`
- **API 의존**: `GET /api/posts/{id}`
- **수용 기준**:
  - [ ] 게시물 이미지 전체 크기 표시
  - [ ] 작성자 아바타 클릭 시 유저 프로필 이동
  - [ ] 좋아요 수, 댓글 수 표시

### F004 — 게시물 수정/삭제

- **우선순위**: P0
- **사용자 스토리**: 내 게시물에 한해 캡션을 수정하거나 게시물 전체를 삭제하고 싶다.
- **관련 파일**:
  - `src/components/post/PostDetail.tsx`
  - `src/components/post/CaptionEditForm.tsx`
  - `src/lib/hooks/use-update-post.ts`
  - `src/lib/hooks/use-delete-post.ts`
- **API 의존**: `PATCH /api/posts/{id}`, `DELETE /api/posts/{id}`
- **수용 기준**:
  - [ ] 본인 게시물에만 수정/삭제 버튼 표시
  - [ ] 삭제 전 확인 다이얼로그(`shadcn/ui Dialog`) 표시
  - [ ] 삭제 완료 후 홈 피드로 이동

### F005 — 좋아요

- **우선순위**: P0
- **사용자 스토리**: 게시물에 좋아요를 누르고 즉각적인 피드백을 받고 싶다.
- **관련 파일**:
  - `src/components/feed/LikeButton.tsx`
  - `src/lib/hooks/use-toggle-like.ts`
- **API 의존**: `POST /api/posts/{id}/likes`, `DELETE /api/posts/{id}/likes`
- **수용 기준**:
  - [ ] 좋아요 토글 시 하트 아이콘 즉시 변경 (낙관적 업데이트)
  - [ ] 좋아요 수 즉시 증감 반영
  - [ ] API 실패 시 이전 상태로 롤백

### F006 — 댓글 작성/삭제

- **우선순위**: P0
- **사용자 스토리**: 게시물에 댓글을 달고, 내 댓글을 삭제할 수 있어야 한다.
- **관련 파일**:
  - `src/components/post/CommentList.tsx`
  - `src/components/post/CommentInput.tsx`
  - `src/lib/hooks/use-comments.ts`
  - `src/lib/hooks/use-create-comment.ts`
  - `src/lib/hooks/use-delete-comment.ts`
- **API 의존**: `GET /api/posts/{id}/comments`, `POST /api/posts/{id}/comments`, `DELETE /api/comments/{id}`
- **수용 기준**:
  - [ ] 빈 댓글 작성 시 버튼 비활성화
  - [ ] 댓글 작성 성공 후 입력 필드 초기화
  - [ ] 본인 댓글에만 삭제 버튼 표시
  - [ ] 삭제 후 목록 즉시 갱신

### F007 — 팔로우/언팔로우

- **우선순위**: P0
- **사용자 스토리**: 관심 있는 사용자를 팔로우하고, 원치 않을 때 언팔로우하고 싶다.
- **관련 파일**:
  - `src/components/profile/FollowButton.tsx`
  - `src/lib/hooks/use-toggle-follow.ts`
  - `src/lib/api/follows.ts`
- **API 의존**: `POST /api/follows/{username}`, `DELETE /api/follows/{username}`
- **수용 기준**:
  - [ ] 팔로우/언팔로우 즉시 버튼 상태 변경 (낙관적 업데이트)
  - [ ] 본인 프로필에는 팔로우 버튼 비표시
  - [ ] 팔로워 수 즉시 반영

### F008 — 유저 프로필 조회

- **우선순위**: P0
- **사용자 스토리**: 다른 사용자의 프로필과 게시물을 보고 팔로우 여부를 결정하고 싶다.
- **관련 파일**:
  - `src/app/(main)/profile/[username]/page.tsx`
  - `src/components/profile/ProfileHeader.tsx`
  - `src/components/post/PostGrid.tsx`
- **API 의존**: `GET /api/users/{username}`, `GET /api/users/{username}/posts`
- **수용 기준**:
  - [ ] 아바타, 사용자명, bio, 통계 표시
  - [ ] 게시물 3열 그리드 표시
  - [ ] 팔로우/언팔로우 버튼 표시

### F009 — 내 프로필 조회

- **우선순위**: P0
- **사용자 스토리**: 내 프로필, 게시물, 팔로우 현황을 한눈에 볼 수 있어야 한다.
- **관련 파일**:
  - `src/app/(main)/profile/page.tsx`
  - `src/lib/hooks/use-my-profile.ts`
- **API 의존**: `GET /api/users/me`
- **수용 기준**:
  - [ ] 본인 정보 정확히 표시
  - [ ] 프로필 수정 버튼 표시

### F010 — 내 프로필 수정

- **우선순위**: P0
- **사용자 스토리**: 프로필 사진, 이름, 소개를 수정하고 싶다.
- **관련 파일**:
  - `src/components/profile/ProfileEditForm.tsx`
  - `src/lib/hooks/use-update-profile.ts`
  - `src/lib/schemas/profile-schema.ts`
- **API 의존**: `PATCH /api/users/me` (multipart/form-data)
- **수용 기준**:
  - [ ] 현재 값을 폼 초기값으로 사전 입력
  - [ ] 아바타 이미지 변경 후 즉시 미리보기
  - [ ] 저장 성공 시 프로필 데이터 갱신

### F011 — 팔로워/팔로잉 목록

- **우선순위**: P1
- **사용자 스토리**: 특정 사용자의 팔로워/팔로잉 목록을 보고 각 사용자를 팔로우할 수 있어야 한다.
- **관련 파일**:
  - `src/app/(main)/follows/[username]/page.tsx`
  - `src/components/profile/FollowListItem.tsx`
  - `src/lib/hooks/use-follow-list.ts`
- **API 의존**: `GET /api/users/{username}/followers`, `GET /api/users/{username}/following`
- **수용 기준**:
  - [ ] 팔로워/팔로잉 탭 전환 동작
  - [ ] 각 사용자 팔로우/언팔로우 버튼 동작
  - [ ] 사용자 행 클릭 시 유저 프로필 이동

### F012 — 탐색 피드

- **우선순위**: P0
- **사용자 스토리**: 팔로우하지 않은 사용자의 게시물도 탐색하여 새로운 콘텐츠를 발견하고 싶다.
- **관련 파일**:
  - `src/app/(main)/explore/page.tsx`
  - `src/components/post/ExploreGrid.tsx`
  - `src/lib/hooks/use-explore-posts.ts`
- **API 의존**: `GET /api/posts/explore?cursor=`
- **목 전략**: 더미 Post[] 배열 (30개), 3페이지 후 종료
- **수용 기준**:
  - [ ] 3열 그리드 레이아웃 표시
  - [ ] 썸네일 호버 시 좋아요수/댓글수 오버레이
  - [ ] 클릭 시 게시물 상세 이동
  - [ ] 무한 스크롤 동작

### F013 — 회원가입

- **우선순위**: P0
- **사용자 스토리**: 이메일, 비밀번호, 사용자명으로 계정을 만들고 싶다.
- **관련 파일**:
  - `src/app/(auth)/register/page.tsx`
  - `src/lib/schemas/auth-schema.ts` — `registerSchema`
  - `src/lib/api/auth.ts` — `register()`
- **API 의존**: `POST /api/auth/register`
- **수용 기준**:
  - [ ] username 영문/숫자/언더스코어 제한 Zod 검사
  - [ ] 이메일 형식 실시간 검사
  - [ ] 비밀번호 최소 8자 검사
  - [ ] 이미 사용 중인 username/email 서버 에러 메시지 표시
  - [ ] 성공 시 자동 로그인 후 `/feed` 이동

### F014 — 로그인

- **우선순위**: P0
- **사용자 스토리**: 이메일과 비밀번호로 로그인하고 싶다.
- **관련 파일**:
  - `src/app/(auth)/login/page.tsx`
  - `src/lib/schemas/auth-schema.ts` — `loginSchema`
  - `src/lib/api/auth.ts` — `login()`
- **API 의존**: `POST /api/auth/login`
- **수용 기준**:
  - [ ] 인증 실패 시 에러 메시지 표시
  - [ ] 비밀번호 표시/숨김 토글 버튼
  - [ ] 성공 시 `useAuthStore`에 user/token 저장 후 `/feed` 이동

### F015 — 로그아웃

- **우선순위**: P0
- **사용자 스토리**: 언제든지 로그아웃하여 세션을 종료하고 싶다.
- **관련 파일**:
  - `src/components/common/Header.tsx`
  - `src/lib/api/auth.ts` — `logout()`
  - `src/lib/stores/use-auth-store.ts` — `logout()`
- **API 의존**: `POST /api/auth/logout`
- **수용 기준**:
  - [ ] 로그아웃 버튼 클릭 시 `useAuthStore` 초기화
  - [ ] TanStack Query 캐시 전체 삭제 (`queryClient.clear()`)
  - [ ] `/` (랜딩 페이지) 리디렉션

---

## 위험 요소 및 의존성

### 기술적 위험

| 위험 | 수준 | 영향 | 대응 방안 |
|------|------|------|-----------|
| 백엔드 API 완성 지연 | 높음 | 모든 API 의존 기능 블로킹 | MSW 또는 목 함수로 병렬 개발 진행 |
| 커서 기반 페이지네이션 미합의 | 중간 | 무한 스크롤 구현 변경 필요 | Sprint 1 내 백엔드팀과 페이지네이션 방식 확정 |
| 이미지 업로드 방식 미결정 | 중간 | PostForm, ProfileEditForm 구현 영향 | multipart/form-data vs presigned URL 방식을 Sprint 1 내 확정 |
| 인증 토큰 저장 방식 미결정 | 높음 | middleware.ts, useAuthStore 전체 영향 | httpOnly 쿠키 vs Authorization 헤더 방식을 Sprint 1 시작 전 확정 |
| Next.js 16 베타 안정성 | 낮음 | 빌드/런타임 오류 가능 | 주요 버전 변경 전 `next.config.ts` 호환성 확인 |

### 백엔드 의존 블로커

- **Sprint 1 필수**: 인증 API (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`) 스펙 확정
- **Sprint 2 필수**: 게시물 CRUD API 스펙 확정, 이미지 업로드 방식 확정
- **Sprint 2-3 필수**: 좋아요/댓글 API 스펙 확정
- **Sprint 3 필수**: 팔로우/언팔로우 API 스펙, 유저 프로필 API 스펙 확정

### MVP 이후 기능 (구현 금지)

스토리, 릴스, 해시태그 검색, 사용자 검색, 실시간 알림, DM, 게시물 저장/북마크, 댓글 좋아요, 대댓글, 소셜 로그인, 계정 비공개 설정

---

## 기술 아키텍처 결정 사항

### 디렉토리 구조

```
src/
├── app/
│   ├── (auth)/                      # 비인증 전용 라우트 그룹
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (main)/                      # 인증 필요 라우트 그룹
│   │   ├── feed/page.tsx
│   │   ├── explore/page.tsx
│   │   ├── post/
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── [username]/page.tsx
│   │   ├── follows/[username]/page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn/ui (CLI 전용 관리, 직접 편집 금지)
│   ├── common/                      # Header, BottomNav, Avatar
│   ├── post/                        # PostForm, PostDetail, PostGrid, CommentList 등
│   ├── profile/                     # ProfileHeader, ProfileEditForm, FollowButton 등
│   └── feed/                        # FeedList, FeedItem, LikeButton
├── lib/
│   ├── api/                         # auth.ts, posts.ts, users.ts, comments.ts, follows.ts
│   ├── hooks/                       # TanStack Query 커스텀 훅
│   ├── stores/                      # use-auth-store.ts, use-ui-store.ts
│   ├── schemas/                     # auth-schema.ts, post-schema.ts, profile-schema.ts
│   └── utils.ts
├── types/                           # user.ts, post.ts, comment.ts, follow.ts
└── middleware.ts
```

### 상태 관리 전략

| 상태 종류 | 도구 | 이유 |
|-----------|------|------|
| 서버 데이터 (게시물, 댓글, 프로필) | TanStack Query | 캐싱, 무한 스크롤, 낙관적 업데이트 지원 |
| 인증 정보 (user, token) | Zustand | 클라이언트 전역 상태, 새로고침 시 복원 필요 |
| UI 상태 (모달 열림 여부 등) | Zustand | 컴포넌트 간 공유 필요한 UI 상태 |
| 폼 상태 | React Hook Form | 폼 전용 최적화, 리렌더 최소화 |

### API 통합 패턴

- Base URL: `process.env.NEXT_PUBLIC_API_URL` (하드코딩 금지)
- 인증 헤더: `Authorization: Bearer {token}` (결정 확정 후 적용)
- 에러 처리: API 함수에서 `throw`, TanStack Query `error` 상태로 UI 처리
- 낙관적 업데이트: 좋아요, 팔로우에 `onMutate` / `onError` / `onSettled` 패턴 적용

### 컴포넌트 전략

- **Server Component 기본**: 정적 레이아웃, 메타데이터, 데이터 없는 구조 컴포넌트
- **Client Component**: `'use client'` 지시어 명시, 이벤트 핸들러/useState/TanStack Query 사용 시 최소 단위로 분리
- 이미지: 반드시 `next/image` `<Image>` 컴포넌트 사용 (`<img>` 태그 금지)
- shadcn/ui 컴포넌트 최대 활용, 커스텀 UI 중복 작성 금지

---

## 프론트엔드 표준 및 지침

### 코딩 컨벤션

| 항목 | 규칙 |
|------|------|
| 파일명 | 컴포넌트: PascalCase (`PostCard.tsx`), 훅/유틸: camelCase (`use-feed-posts.ts`) |
| 컴포넌트 함수명 | PascalCase, 파일명과 동일 |
| Props 타입 | `interface [ComponentName]Props` |
| 내보내기 | `export default` |
| TypeScript | `any` 금지, `unknown` 또는 명시적 타입 사용 |
| 스타일 | TailwindCSS v4 유틸리티 클래스만, `style={}` 인라인 금지 |
| 클래스 조합 | `cn()` 유틸리티 사용 (`clsx` + `tailwind-merge`) |

### 금지 사항

- 백엔드(`/backend`) 코드 수정 금지
- `components/ui/` 직접 편집 금지 (shadcn CLI로만 관리)
- `any` 타입 사용 금지
- 인라인 `style={}` 사용 금지
- API URL 하드코딩 금지 (`NEXT_PUBLIC_API_URL` 환경변수 필수)
- `<img>` 태그 직접 사용 금지 (`next/image` 사용)
- 서버 데이터를 Zustand에 저장 금지 (TanStack Query 사용)
- `pages/` 라우터 사용 금지 (App Router만 사용)
- MVP 이후 기능 구현 금지

### 성능 기준

- Lighthouse Performance 목표: 80점 이상
- 이미지: `next/image` `sizes` 속성 최적화, WebP 우선 허용
- 무한 스크롤: Intersection Observer API 사용 (scroll 이벤트 금지)
- 번들: `next/dynamic` 활용 코드 스플리팅 (필요 시)

### 접근성 기준

- WCAG 2.1 Level AA 준수
- 모든 이미지에 의미있는 `alt` 속성 필수
- 버튼에 `aria-label` 필수 (아이콘 전용 버튼)
- 폼 필드에 `label` 연결 필수

---

## 테스트 전략

> MVP 4주 일정상 E2E 수동 테스트를 우선으로 하며, 단위 테스트는 핵심 유틸/스키마 위주로 작성한다.

### 수동 E2E 테스트 시나리오 (Sprint 4 QA)

| # | 시나리오 | 확인 항목 |
|---|----------|-----------|
| 1 | 신규 사용자 회원가입 | 입력 검증 → 성공 → `/feed` 이동 → 빈 피드 안내 표시 |
| 2 | 기존 사용자 로그인 | 성공 → `/feed` 이동, 실패 → 에러 메시지 표시 |
| 3 | 게시물 작성 | 이미지 업로드 → 미리보기 → 캡션 입력 → 공유 → 피드 반영 |
| 4 | 좋아요 토글 | 피드/상세 모두 즉시 반영, 새로고침 후에도 유지 |
| 5 | 댓글 작성/삭제 | 작성 성공 → 목록 반영, 삭제 성공 → 목록에서 제거 |
| 6 | 팔로우/언팔로우 | 버튼 즉시 변경, 팔로워 수 반영 |
| 7 | 내 프로필 수정 | 사진/이름/소개 변경 저장 → 프로필 페이지 반영 |
| 8 | 탐색 피드 | 3열 그리드 표시, 무한 스크롤, 게시물 상세 이동 |
| 9 | 비인증 라우트 보호 | `/feed` 직접 접근 → `/login` 리디렉션 |
| 10 | 인증 후 auth 그룹 접근 | 로그인 상태에서 `/login` 접근 → `/feed` 리디렉션 |

### 핵심 단위 테스트 대상 (권장)

- `src/lib/schemas/auth-schema.ts` — 유효/무효 입력 케이스
- `src/lib/schemas/post-schema.ts` — 이미지 필수, 캡션 길이 제한
- `src/lib/utils.ts` — `cn()` 함수

---

## 진행 추적

### 스프린트 구성

- 스프린트 기간: 1주 (월~금)
- 데일리 스탠드업: 작업 단위 PR 기반 진행 상황 공유
- 스프린트 리뷰: 매주 금요일 백엔드 팀과 API 연동 상태 공유

### 완료 기준 (Definition of Done)

- [ ] 기능이 로컬 개발 환경에서 정상 동작
- [ ] TypeScript 컴파일 에러 0건
- [ ] ESLint 에러 0건
- [ ] 해당 기능의 수용 기준 체크리스트 전항목 충족
- [ ] `next/image` 사용, `any` 타입 미사용, `NEXT_PUBLIC_API_URL` 환경변수 사용 확인
- [ ] PR 코드 리뷰 완료

### 우선순위별 태스크 요약

| 우선순위 | 기능 ID | 기능명 | 목표 스프린트 |
|----------|---------|--------|--------------|
| P0 | F013, F014, F015 | 인증 전체 | Sprint 1 |
| P0 | F001, F002, F003, F004, F005 | 게시물 CRUD + 홈 피드 + 좋아요 | Sprint 2 |
| P0 | F006, F007, F008, F009, F010 | 댓글 + 프로필 + 팔로우 | Sprint 3 |
| P0 | F012 | 탐색 피드 | Sprint 4 |
| P1 | F011 | 팔로워/팔로잉 목록 | Sprint 3 |

---

## 미결 사항 및 필요 확인

### 백엔드 팀과 확정 필요 (Sprint 1 착수 전)

1. **인증 토큰 저장 방식**: `httpOnly` 쿠키 응답 vs 응답 바디의 JWT 토큰을 `Authorization: Bearer` 헤더로 전달 — `middleware.ts` 구현 방향 결정에 직접 영향
2. **페이지네이션 방식**: 커서 기반(`cursor` + `nextCursor`) vs 오프셋 기반(`page` + `size`) — `useInfiniteQuery` 구현 방향 결정에 직접 영향
3. **이미지 업로드 방식**: 백엔드가 multipart/form-data를 직접 처리 vs 프론트엔드에 presigned URL 제공 후 S3 직접 업로드 — `PostForm`, `ProfileEditForm` 구현 방향 결정에 직접 영향
4. **에러 응답 포맷**: 서버 에러 JSON 구조 (`{ message, code }` 형식 등) — 에러 처리 유틸 함수 구현에 영향

### 추가 확인 필요

5. **배포 플랫폼**: Vercel, Docker, AWS 등 — Sprint 4 배포 준비 태스크에 영향
6. **이미지 CDN 도메인**: `next.config.ts`의 `images.remotePatterns` 설정에 필요
7. **CORS 설정**: 백엔드에서 프론트엔드 개발 서버(`localhost:3000`) 허용 여부 확인 필요

---

## 가정 사항

- Next.js 16 (App Router)을 사용하며, `pages/` 디렉토리는 사용하지 않는다.
- 백엔드는 RESTful JSON API를 제공하며, GraphQL은 사용하지 않는다.
- 페이지네이션은 커서 기반으로 합의된다고 가정하고 `useInfiniteQuery`로 구현한다 (변경 시 수정 필요).
- 인증 토큰은 `Authorization: Bearer` 헤더 방식으로 합의된다고 가정한다 (httpOnly 쿠키 방식으로 변경 시 `middleware.ts` 수정 필요).
- 이미지 업로드는 multipart/form-data 방식으로 백엔드가 처리한다고 가정한다.
- 게시물 이미지는 백엔드 응답의 `image_url` 필드로 CDN URL이 제공된다고 가정한다.
- 모바일 우선(375px~) 반응형으로 구현하며, 데스크탑 레이아웃은 최대 630px 너비 중앙 정렬 방식으로 한다.
- 다크모드는 `next-themes` + TailwindCSS `dark:` 접두사로 지원하되, MVP에서 완전한 다크모드 완성도는 P2로 처리한다.
