import requests
import re
import json

fantasy_pro_url = 'https://www.fantasypros.com/nfl/rankings/ppr-cheatsheets.php'

response = requests.get(fantasy_pro_url)
html_raw = response._content

html = html_raw.decode()

start_string = 'var ecrData = '
end_string = ';'

json_start = html.find(start_string) + len(start_string)
json_end = html.find(end_string, json_start)

json_object = html[json_start:json_end]

ranks = json.loads(json_object)
players = ranks["players"]

player_ranks = []

for p in players:
    player = {}
    player['Rank'] = p['rank_ecr']
    player['Name'] = p['player_name']
    player['Team'] = p['player_team_id']
    player['Position'] = p['player_positions']
    player['Position Rank'] = int(re.findall('[0-9]+',p['pos_rank'])[0])
    player_ranks.append(player)

with open("draft-helper/src/data/fantasy-pros.json", "w") as outfile:
    outfile.write(json.dumps(player_ranks, indent=4))

# with open('tempURL.txt', 'r', encoding='utf-8') as f:
#     html = f.read()
