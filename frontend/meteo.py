from meteofrance_api import MeteoFranceClient

def main():
    try:
        # Create API client
        client = MeteoFranceClient()

        # Search for a location (e.g., Paris)
        places = client.search_places("Paris")
        if not places:
            print("Location not found.")
            return

        # Take the first matching location
        #paris = places[0]
        print(places)

        # Get daily forecast
        forecast = client.get_forecast(latitude=5.014333, longitude=47.319167)
        #print(f"Weather forecast for {paris['name']}:")
        for day in forecast.daily_forecast:
            print(f"{day['dt']} - {day['weather12H']['desc']} - {day['T']['min']}°C / {day['T']['max']}°C")

        # Get rain forecast (if available)
        #rain_forecast = client.get_rain(paris["id"])
        #if rain_forecast:
         #   print("\nRain forecast for the next hour:")
          #  for slot in rain_forecast.forecast:
           #     print(f"{slot['dt']} - {slot['rain']}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()