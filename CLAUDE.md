# tech-blog 작업 규칙

## 글의 대문 이미지(hero)

- 대문 이미지는 반드시 그 글 본문에 실제로 들어 있는 이미지를 쓴다. 대문·카드 전용 그림을 따로 만들지 않는다.
- `content/article-metadata.json`의 `hero.src`는 본문 `<img>`의 경로와 같아야 하고, `hero.alt`는 본문에서 쓴 대체 텍스트를 그대로 쓴다.
- 본문에 없는 이미지를 지정하면 `npm run prepare:content`(빌드 포함)가 "Hero image is not an image of the article body" 오류로 실패한다.
- 고를 때는 글의 핵심 결과를 보여 주는 그림 가운데 가로로 넓고 글자가 큰 것을 우선한다. 홈 대표 칸은 5:3, 목록 카드는 1:1 상자에 그림 전체를 맞춰 넣는다.
- 본문에 알맞은 그림이 없으면 `hero`를 지정하지 않는다. 이 경우 그 글은 홈 대표 칸에 오르지 않고 "최근 글"에 나온다.
