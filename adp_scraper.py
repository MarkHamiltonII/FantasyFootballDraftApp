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

url = 'https://www.fantasypros.com/nfl/adp/ppr-overall.php'

html = requests.get(url, headers={'User-Agent': random.choice(user_agents_list)}).text

# with open('tempURL.txt','w', encoding="utf-8") as f:
#     f.write(html)

# with open('tempURL.txt','r', encoding='utf-8') as f: 
    # html = f.read()

soup = BeautifulSoup(html, "html.parser")
players = soup.find_all("a", class_="player-name")
player_ranks = []


for idx, player in enumerate(players):
    name = player.text.strip()
    name_index = html.find(name)
    start = html.find('<small>', name_index) + 7
    end = html.find('</small>', name_index)
    team = html[start:end]
    start = html.find('<td>', name_index) + 4
    current_index = start
    rank = ''
    while html[current_index] != '<':
        rank += html[current_index]
        current_index+=1
    pos_rank = re.findall('[0-9]+', rank)[0]
    pos = re.findall('[A-Z]+', rank)[0]

    for _ in range(7):
        start = html.find("<td>",start)+4
    current_index = start
    adp = ''
    while html[current_index] != '<':
        adp += html[current_index]
        current_index+=1
    print("ADP:", adp)
    player_data = {
        "Rank": idx+1,
        "Name": name,
        "Team": team,
        "Position": pos,
        "Position Rank": int(pos_rank),
        "ADP": float(adp)
    }
    player_ranks.append(player_data)

with open("draft-helper/src/data/adp.json", "w") as outfile:
    outfile.write(json.dumps(player_ranks, indent=4))