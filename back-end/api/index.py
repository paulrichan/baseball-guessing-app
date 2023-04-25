from flask import Flask
import mlbstatsapi
import random
from flask_cors import CORS, cross_origin

mlb = mlbstatsapi.Mlb()

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/game")
@cross_origin()
def index():
    # TODO: route params: season
    api_all_plyrs = mlb.get_people(1, season=2023)
    
    # find two random players
    def is_pitcher(player):
        return player.primaryposition.abbreviation == "P"
    
    def get_random_player():
        player = random.choice(api_all_plyrs)
        if is_pitcher(player) or not player.active: 
            return get_random_player()
        return player
    
    player_1 = get_random_player()
    player_2 = get_random_player()
    find_players = [player_1, 
                    player_2 if player_1.id != player_2.id else get_random_player()]
    
    # get player stats and format new array
    # TODO: provide route param for hitting or pitching
    groups = ['hitting']
    stats = ['season']
    player_1_stats = mlb.get_player_stats(find_players[0].id, stats, groups, season=2023)['hitting']['season'].splits[0].stat
    player_2_stats = mlb.get_player_stats(find_players[1].id, stats, groups, season=2023)['hitting']['season'].splits[0].stat
    # print(player_1_stats['season'].splits[0].stat)
    players_to_compare = [{"player": find_players[0], "stats": player_1_stats}, 
                          {"player": find_players[1], "stats": player_2_stats}]
    
    return players_to_compare
