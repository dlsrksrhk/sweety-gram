---
name: Sweety Gram 프로젝트 기본 정보
description: 기술 스택, 디렉토리 구조, 핵심 제약사항 — 모든 코드 작업 시 기준
type: project
---

## 기술 스택

- Next.js 16 (App Router, Server Components) — pages/ 라우터 사용 금지
- React 19, TypeScript 5
- TailwindCSS v4 + shadcn/ui + Lucide React
- TanStack Query 5 (서버 상태, useInfiniteQuery 포함)
- Zustand 5 (클라이언트 전역 상태: 인증 정보, UI 상태만)
- React Hook Form 7 + Zod 4 (모든 폼)
- next-themes (다크모드)
- Sonner (토스트 알림)
- 백엔드: Spring Boot 3.x (Java 17+, JPA, Spring Security) — 프론트엔드에서 코드 수정 금지

## 핵심 규칙

- `components/ui/` 직접 편집 금지 (shadcn CLI만)
- `any` 타입 사용 금지
- 인라인 `style={}` 사용 금지
- API URL 하드코딩 금지 (`NEXT_PUBLIC_API_URL` 환경변수 필수)
- `<img>` 태그 금지 (`next/image` 사용)
- 서버 데이터를 Zustand에 저장 금지 (TanStack Query 사용)
- MVP 이후 기능 구현 금지 (스토리, 릴스, 알림, DM, 북마크, 대댓글, 소셜 로그인 등)

## 디렉토리 구조 핵심

- 페이지: `src/app/(auth)/`, `src/app/(main)/`
- 컴포넌트: `src/components/{common|post|profile|feed}/`
- API 함수: `src/lib/api/{auth|posts|users|comments|follows}.ts`
- TanStack Query 훅: `src/lib/hooks/use-*.ts`
- Zustand 스토어: `src/lib/stores/use-*-store.ts`
- Zod 스키마: `src/lib/schemas/*-schema.ts`
- 타입 정의: `src/types/{user|post|comment|follow}.ts`

**Why:** PRD + shrimp-rules.md 기반으로 확정된 아키텍처. 이 구조를 벗어나는 코드 작성은 규칙 위반.

**How to apply:** 새 파일 생성 시 위 경로 규칙 준수. 컴포넌트 작성 시 PascalCase 파일명, `interface [Name]Props`, `export default`.
