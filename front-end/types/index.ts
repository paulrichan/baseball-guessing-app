export interface Player {
   active: boolean
   batside: BatSide
   birthcity: string
   birthcountry: string
   birthdate: string
   birthstateprovince: string | null
   boxscorename: string
   currentage: number
   currentteam: CurrentTeam
   deathcity: string | null
   deathcountry: string | null
   deathdate: string | null
   deathstateprovince: string | null
   draftyear: number | null
   firstlastname: string
   firstname: string
   fullfmlname: string
   fulllfmname: string
   fullname: string
   gender: string
   height: string
   id: number
   initlastname: string
   isplayer: boolean
   isverified: boolean
   lastfirstname: string
   lastinitname: string
   lastname: string
   lastplayeddate: string | null
   link: string
   middlename: string | null
   mlbdebutdate: string
   namefirstlast: string
   namematrilineal: string
   nameslug: string
   namesuffix: string | null
   nametitle: string | null
   nickname: string | null
   pitchhand: PitchHand
   primarynumber: string
   primaryposition: PrimaryPosition
   pronunciation: string
   strikezonebottom: number
   strikezonetop: number
   uselastname: string
   usename: string
   weight: number
}

export interface BatSide {
   code: string
   description: string
}

export interface CurrentTeam {
   id: number
   link: string
   name: string
}

export interface PitchHand {
   code: string
   description: string
}

export interface PrimaryPosition {
   abbreviation: string
   code: string
   name: string
   type: string
}

export interface Stats {
   airouts: number
   atbats: number
   atbatsperhomerun: string
   avg: string
   babip: string
   baseonballs: number
   catchersinterference: number
   caughtstealing: number
   doubles: number
   gamesplayed: number
   groundintodoubleplay: number
   groundintotripleplay: number | null
   groundouts: number
   groundoutstoairouts: string
   hitbypitch: number
   hits: number
   homeruns: number
   intentionalwalks: number
   leftonbase: number
   numberofpitches: number
   obp: string
   ops: string
   plateappearances: number
   rbi: number
   runs: number
   sacbunts: number
   sacflies: number
   slg: string
   stolenbasepercentage: string
   stolenbases: number
   strikeouts: number
   totalbases: number
   triples: number
}
