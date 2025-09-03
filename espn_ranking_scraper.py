import requests
import random
import re
import json
from bs4 import BeautifulSoup

user_agents_list = [
    'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
]

field_url = 'https://www.espn.com/fantasy/football/story/_/id/45915931/2025-fantasy-football-rankings-ppr-field-yates-qb-rb-wr-te'
tristan_url = 'https://www.espn.com/fantasy/football/story/_/id/45042111/fantasy-football-rankings-2025-ppr'
clay_url = 'https://www.espn.com/fantasy/football/story/_/id/43261183/2025-fantasy-football-rankings-ppr-mike-clay'

field_html = requests.get(field_url, headers={'User-Agent': random.choice(user_agents_list)})
tristan_html = requests.get(tristan_url, headers={'User-Agent': random.choice(user_agents_list)})
clay_html = requests.get(clay_url, headers={'User-Agent': random.choice(user_agents_list)})






html = tristan_html.text
soup = BeautifulSoup(html,'html.parser')
name_links = soup.find_all('a', href = lambda str: "https://www.espn.com/nfl/player/_/id/" in str or "http://www.espn.com/nfl/player/_/id/" in str)

beginning = html.find(name_links[0].text)
player_ranks = []

# Tristan processing
for idx, link in enumerate(name_links):
    name = link.text.strip()
    name_index = html.find(name, beginning)
    start = html.find(">", name_index) + 3
    end = html.find("<", start)
    team, rank = html[start:end].split(', ')
    pos = re.findall('[A-Z]+', rank)[0]
    pos_rank = re.findall('[0-9]+', rank)[0]

    player = {
        "Rank": idx+1,
        "Name": name,
        "Team": team,
        "Position": pos,
        "Position Rank": int(pos_rank)
    }
    player_ranks.append(player)
    if idx == 199: # started including position rankings after 200
        break

with open("draft-helper/src/data/tristan_ranks.json", "w") as outfile:
    outfile.write(json.dumps(player_ranks, indent=4))






# Field Processing

# html = field_html.text
# soup = BeautifulSoup(html,'html.parser')
# name_links = soup.find_all('a', href = lambda str: "https://www.espn.com/nfl/player/_/id/" in str)

# beginning = html.find(name_links[0].text)
# player_ranks = []

# for idx, link in enumerate(name_links):
#     name = link.text.strip()
#     name_index = html.find(name, beginning)
#     start = html.find(">", name_index) + 3
#     end = html.find("<", start)
#     team, rank = html[start:end].split()
#     pos_rank = re.findall('[0-9]+', rank)[0]
#     pos = re.findall('[A-Z]+', rank)[0]
#     rank = rank[1:-1]

#     player = {
#         "Rank": idx+1,
#         "Name": name,
#         "Team": team,
#         "Position": pos,
#         "Position Rank": int(pos_rank)
#     }
#     player_ranks.append(player)

# with open("draft-helper/src/data/field_ranks.json", "w") as outfile:
#     outfile.write(json.dumps(player_ranks, indent=4))






# # Mike Clay Processing

# html = clay_html.text
# soup = BeautifulSoup(html,'html.parser')
# name_links = soup.find_all('a', href = lambda str: "https://www.espn.com/nfl/player/_/id/" in str or "http://www.espn.com/nfl/player/_/id/" in str)

# beginning = html.find(name_links[0].text)
# player_ranks = []

# for idx, link in enumerate(name_links):
#     name = link.text.strip()
#     name_index = html.find(name, beginning)
#     start = html.find(">", name_index) + 3
#     end = html.find("<", start)
#     player_descriptors = html[start:end] # ie: SF -- RB1, $57 (Bye: 9)
#     team, pos, _ = re.findall('[A-Z]+', player_descriptors)
#     pos_rank = re.findall('[0-9]+', player_descriptors)[0]
#     if idx == 200: # top 200 -- sometimes he includes position rankings on the same page
#         break

#     player = {
#         "Rank": idx+1,
#         "Name": name,
#         "Team": team,
#         "Position": pos,
#         "Position Rank": int(pos_rank)
#     }
#     player_ranks.append(player)

# with open("draft-helper/src/data/clay_ranks.json", "w") as outfile:
#     outfile.write(json.dumps(player_ranks, indent=4))