from flask import Flask, request
import mlbstatsapi
import random
from flask_cors import CORS, cross_origin
from werkzeug.middleware.proxy_fix import ProxyFix
import os

mlb = mlbstatsapi.Mlb()

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.wsgi_app = ProxyFix(app.wsgi_app)

@app.route('/')
def dead_route():
    return "Hello, world!"

@app.route("/game/<player_type>/<stat_to_compare>", methods=["GET"])
@cross_origin()
def index(player_type, stat_to_compare):
    args = request.args.to_dict()
    player_type = f'{player_type}'
    
    # TODO: route params: season
    api_all_plyrs = mlb.get_people(1, season=2023)
    
    # find two random players
    def is_pitcher(player):
        return player.primaryposition.abbreviation == "P"
    
    def get_random_player():
        player = random.choice(api_all_plyrs)
        # NOTE: this might be overkill but better safe than sorry?
        if player_type == 'hitting' and is_pitcher(player) or not player.active or player_type == 'pitching' and not is_pitcher(player): 
            return get_random_player()
        return player
    
    player_1 = get_random_player()
    player_2 = get_random_player()
    find_players = [player_1, 
                    player_2 if player_1.id != player_2.id else get_random_player()]
    
    # get player stats and format new array
    def get_player_stats(player_id):
        groups = [player_type]
        stats = ['season']
        player_stats = mlb.get_player_stats(player_id, stats, groups, season=2023)[player_type]['season'].splits[0].stat
        if not player_stats:
            return get_player_stats(player_id)
        return player_stats
   
    players_to_compare = [{"player": find_players[0], "stats": get_player_stats(find_players[0].id)}, 
                          {"player": find_players[1], "stats": get_player_stats(find_players[1].id)}]
    
    return players_to_compare

if __name__ == "__main__":
    from waitress import serve
    serve(app, host='0.0.0.0', port=os.environ["PORT"])
    # app.run()