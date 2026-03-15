---
name: 백엔드 협업 패턴 및 미결 사항
description: Spring Boot 백엔드 팀과 사전 합의 필요한 API 계약 항목 및 목 개발 전략
type: project
---

## Sprint 1 착수 전 반드시 확정 필요한 항목

1. **인증 토큰 방식**: httpOnly 쿠키 vs Authorization Bearer 헤더
   - 결정에 따라 `src/middleware.ts` 구현 방식 완전히 달라짐

2. **페이지네이션 방식**: 커서 기반(`cursor` + `nextCursor`) vs 오프셋 기반(`page` + `size`)
   - TanStack Query `useInfiniteQuery`의 `getNextPageParam` 구현 방향 결정

3. **이미지 업로드 방식**: 백엔드 multipart 직접 처리 vs presigned URL S3 직접 업로드
   - `PostForm`, `ProfileEditForm` 구현 방향 결정

4. **에러 응답 포맷**: `{ message: string, code: string }` 통일 필요

## 목(Mock) 개발 전략

백엔드 API 미완성 구간에서 `src/lib/api/` 내 목 함수로 대체:
- `fetchFeedPosts()` → 더미 Post[] 15개, 2페이지 후 nextCursor: undefined
- `fetchExplorePosts()` → 더미 Post[] 30개, 3페이지 후 종료
- `login()` → `{ token: 'mock-token', user: { id, username, email, avatar_url, bio } }`

목 제거 기준: NEXT_PUBLIC_API_URL을 실제 배포 URL로 전환 시 자동 전환

## API 엔드포인트 패턴 (합의 예정)

- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- 모든 인증 필요 엔드포인트: `Authorization: Bearer {token}` 헤더
- 게시물 목록: cursor-based pagination 예정
- 이미지 포함 API: multipart/form-data 예정

**Why:** 프론트엔드 전담팀이 백엔드 API 완성 전에 병렬 개발을 진행해야 함.

**How to apply:** API 함수 작성 시 항상 환경변수 사용, 미완성 API는 목 함수로 대체하고 주석으로 "TODO: Replace with real API" 표시.
