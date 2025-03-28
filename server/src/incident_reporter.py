from pydantic import BaseModel
from dotenv import load_dotenv
import logging
from fastapi import Query, HTTPException
from src.Database_class import DataBase

class Location(BaseModel):
    latitude: float
    longitude: float

class IncidentReport(BaseModel):
    type: str
    title: str
    comment: str
    timestamp: str
    location: Location


class IncidentReporter:
    def __init__(self, api, logger: logging.Logger):
        self.app = api
        self.logger = logger

        # Load environment vars
        load_dotenv()

        self.api_report_incident()

    def api_report_incident(self):
        @self.app.post("/report_incident")
        async def report_incident(request: IncidentReport):

            self.logger.info(f"Incident report for {request.type}")

            response = self.db_handle_incident_report(
                request
            )

            return {"message": response}
    
    def db_handle_incident_report(self, request: IncidentReport):
        db = DataBase()
        db.connect_db()
        table_name = "incident_table"
        type_column = "type"
        title_column = "title"
        comment_column = "comment"
        timestamp_column = "timestamp"
        latitude_column = "latitude"
        longitude_column = "longitude"

        incident_dict = {
            type_column: request.type,
            title_column: request.title,
            comment_column: request.comment,
            timestamp_column: request.timestamp,
            latitude_column: request.location.latitude,
            longitude_column: request.location.longitude
        }

        db.add_entry(table_name, incident_dict)

        self.logger.info("Incident report sent successfully")
        db.close_con()

if __name__ == "__main__":
    pass