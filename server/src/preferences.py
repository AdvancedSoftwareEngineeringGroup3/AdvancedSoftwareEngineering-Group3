from Database_class import DataBase

class UserPersonalizedSettings:
    
    def __init__(self, walkspeed = 0, travelMode = {'bus':False, 'car':False, 'train':False, 'walk':False, 'bike':False, 'tram':False}, 
                 bike = False, privateVehicle = False, accessibility = None, motorways = False, tolls = False):
        
        self.walkingSpeed = walkspeed
        self.travelMode = travelMode
        self.bike = bike
        self.privateVehicle = privateVehicle
        self.accessibility = accessibility
        self.motorways = motorways
        self.tolls = tolls
        self.database = DataBase()
        self.tablename = "personalisedSettings"
        
    
        

    def writePersonlisedSettings(self, username):
        #TODO check if user info is in the database
        """Writes personalise components. If no user data used add_entry 
        if user exists use update_entry.

        Args:
            username (_type_): _description_
        """
        self.database.connect_db()


        databaseDict = {"Username": username,
                        "WalkingSpeed": self.walkingSpeed,
                        "TravelMode": self.travelMode,
                        "Bike":self.bike,
                        "PrivateVehicle": self.privateVehicle,
                        "Accessibility": self.accessibility,
                        "Motorways": self.motorways,
                        "Toll":self.tolls}

        self.database.add_entry(self.tablename, databaseDict)



        self.database.close_con()


        return