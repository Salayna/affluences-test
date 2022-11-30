# Affluences Coding test
The Goal was to create a REST API that would connect to a micro services managing availabilities for places.
## How to use it ?
- Create a ``.env`` file in the root directory of the project
- Add a PORT entry in the file to specify the port on which the API will run
- Don't forget to install the dependencies 😎
The needed end point is  ``/availability``.  
### Example
``http://localhost:3000/availabity?date=2022-11-30&time=8:00&resourceId=1337``