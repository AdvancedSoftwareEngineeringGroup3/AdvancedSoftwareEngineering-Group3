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
        
        
    
        
    