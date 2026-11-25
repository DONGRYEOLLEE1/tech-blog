# tech-blog 작업 규칙

## 글의 대문 이미지(hero)

- 대문 이미지는 반드시 그 글 본문에 실제로 들어 있는 이미지를 쓴다. 대문·카드 전용 그림을 따로 만들지 않는다.
- `content/article-metadata.json`의 `hero.src`는 본문 `<img>`의 경로와 같아야 하고, `hero.alt`는 본문에서 쓴 대체 텍스트를 그대로 쓴다.
- 본문에 없는 이미지를 지정하면 `npm run prepare:content`(빌드 포함)가 "Hero image is not an image of the article body" 오류로 실패한다.
- 고를 때는 글의 핵심 결과를 보여 주는 그림 가운데 가로로 넓고 글자가 큰 것을 우선한다. 홈 대표 칸은 5:3, 목록 카드는 1:1 상자에 그림 전체를 맞춰 넣는다.
- 본문에 알맞은 그림이 없으면 `hero`를 지정하지 않는다. 이 경우 그 글은 홈 대표 칸에 오르지 않고 "최근 글"에 나온다.

## 새 글을 올릴 때 연관 글 갱신

새 글을 추가하거나 기존 글의 본문·메타데이터를 고치면, 같은 PR 안에서 연관 글 추천을 다시 계산해 반영한다. 동기화를 건너뛰어도 빌드는 성공하지만, 그 글은 규칙 기반 추천으로만 보이고 기존 글의 목록에도 새 글이 들어가지 않는다. 절차의 자세한 설명은 `docs/content-authoring.md` '새 글 발행과 연관 글 추천'에 있다.

1. 저장소 루트에 `.env`가 있는지 확인한다. `OPENROUTER_API_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`가 필요하다(`.env.example` 참고). 없으면 동기화를 건너뛰고 발행하지 말고, 사용자에게 `.env`를 요청한다. 값은 출력하거나 커밋하지 않는다.
2. 원문과 `content/article-metadata.json`을 고친 뒤 `npm run recommendations:sync -- --dry-run`으로 다시 계산할 글을 확인한다.
3. `npm run recommendations:sync`를 실행한다. 종료 코드 2는 일부 글이 `fallback`으로 저장됐다는 뜻이므로 한 번 더 실행해 그 글만 재시도한다.
4. `npm run recommendations:check`로 낡은 추천 파일이 없는지 확인한다.
5. `content/related/`의 변경분에서 새 글의 추천과 이유 문장, 그리고 새 글이 추가된 기존 글의 목록을 읽는다. 무관한 연결은 `content/knowledge/overrides.json`의 `excludes`로 빼고 다시 동기화한다. 연결은 맞지만 이유 문장이 틀리면 `content/knowledge/reasons.json`에 고친 문장을 넣는다.
6. 빌드 로그의 '연관 글: LLM N편, 규칙 M편' 줄에서 규칙 추천 글 수가 늘지 않았는지 확인한다. 새 글의 `content/related/<글 id>.json`이 있어야 하고, `generated/related-report.json`의 `missing`이 늘지 않아야 한다.
7. 원문, 메타데이터와 함께 `content/related/`의 바뀐 파일(삭제 포함)을 같은 커밋에 넣는다. `.cache/`와 `generated/related-report.json`은 커밋하지 않는다.
8. PR 본문의 '확인'에 다시 계산한 글 수와 검토 결과(뺀 연결, 고친 문장)를 적는다.
