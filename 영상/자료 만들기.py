"""시연 영상용 가상 명단(등촌제3동 39명)과 짝 맺기 결과를 만든다. 사람과 숫자는 모두 가상이다."""
import json, math, random, os
import networkx as nx

random.seed(7)
men = ['장득춘', '황진호', '황정수', '김봉수', '이상철', '박영식', '최만석', '정길수', '윤덕배', '한상호',
       '오병철', '서재문', '신동규', '권태식', '조영길', '배성만', '유창호', '남궁현']
women = ['강영자', '김순자', '이옥희', '박말순', '최정숙', '정영희', '윤복순', '한순례', '오금자', '서명숙',
         '신영순', '권옥자', '조순희', '배정자', '유분이', '남숙자', '임춘자', '송말자', '전정순', '홍복례', '문영옥']

def person(name, sex):
    w = max(72, min(162, random.gauss(116, 19)))
    c = max(7, min(24, 8 + 0.06 * w + random.gauss(0, 2.2)))
    # 지도 위치: 가로 0~1, 세로 0~1 (동 윤곽 안)
    while True:
        x, y = random.random(), random.random()
        if ((x - .5) / .48) ** 2 + ((y - .5) / .44) ** 2 < 1:
            break
    return dict(name=name, sex=sex, walk=round(w), chair=round(c), mx=round(x, 3), my=round(y, 3))

P = [person(n, 'M') for n in men] + [person(n, 'F') for n in women]
by = {p['name']: p for p in P}
# 주인공과 짝 후보의 체력을 정해 둔다
by['장득춘'].update(walk=112, chair=14, mx=.42, my=.46)
by['황진호'].update(walk=114, chair=14)
by['황정수'].update(walk=110, chair=15)
# 짝을 못 찾는 사람: 체력이 크게 낮은 분
by['강영자'].update(walk=66, chair=6)

def z(p):
    return ((p['walk'] - 116) / 19, (p['chair'] - 15) / 3)

def match(group):
    G = nx.Graph()
    for i, a in enumerate(group):
        for b in group[i + 1:]:
            za, zb = z(a), z(b)
            G.add_edge(a['name'], b['name'], weight=-math.dist(za, zb))
    return [tuple(sorted(e, key=lambda n: n != '장득춘')) for e in nx.max_weight_matching(G, maxcardinality=True)]

# 주인공 짝은 황진호로 고정, 황정수는 나머지와 맺는다
mpool = [p for p in P if p['sex'] == 'M' and p['name'] not in ('장득춘', '황진호')]
fpool = [p for p in P if p['sex'] == 'F' and p['name'] != '강영자']
pairs = [('장득춘', '황진호')] + match(mpool) + match(fpool)
assert len(pairs) == 19, len(pairs)
# 황정수의 처음 짝(7주부터 그만둠)
hj = next(pr for pr in pairs if '황정수' in pr)
pairs.remove(hj); pairs.insert(1, ('황정수', hj[0] if hj[1] == '황정수' else hj[1]))

# 출석: 짝마다 12주, 1 나옴 0 안 나옴
random.seed(3)
att = []
for i, pr in enumerate(pairs):
    row = [1 if random.random() > .1 else 0 for _ in range(12)]
    if i == 0:  # 장득춘 짝: 6~8주 황진호 안 나옴, 9주부터 새 짝과 다시 나옴
        row = [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1]
    if i == 1:  # 황정수 짝: 7~8주 짝이 그만둠
        row = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
    att.append(row)

out = dict(people=P, pairs=pairs, unmatched='강영자', attendance=att,
           hero=dict(name='장득춘', age=78, chair=[14, 16], walk=[112, 121], first='황진호', second='황정수',
                     place='월드메르디앙 경로당', time='화·금 오전 10시'))
os.makedirs(os.path.dirname(__file__) or '.', exist_ok=True)
open(os.path.join(os.path.dirname(__file__), '자료.js'), 'w', encoding='utf-8').write('window.D = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(len(P), 'people', len(pairs), 'pairs', pairs[:3])
