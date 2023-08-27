import math


class Reward:
    def __init__(self, verbose=False):
        self.first_racingpoint_index = 0
        self.verbose = verbose

    def reward_function(self, params):

        # Import package (needed for heading)
        import math

        ################## HELPER FUNCTIONS ###################

        def dist_2_points(x1, x2, y1, y2):
            return abs(abs(x1-x2)**2 + abs(y1-y2)**2)**0.5

        def closest_2_racing_points_index(racing_coords, car_coords):

            # Calculate all distances to racing points
            distances = []
            for i in range(len(racing_coords)):
                distance = dist_2_points(x1=racing_coords[i][0], x2=car_coords[0],
                                         y1=racing_coords[i][1], y2=car_coords[1])
                distances.append(distance)

            # Get index of the closest racing point
            closest_index = distances.index(min(distances))

            # Get index of the second closest racing point
            distances_no_closest = distances.copy()
            distances_no_closest[closest_index] = 999
            second_closest_index = distances_no_closest.index(
                min(distances_no_closest))

            return [closest_index, second_closest_index]

        def dist_to_racing_line(closest_coords, second_closest_coords, car_coords):
            
            # Calculate the distances between 2 closest racing points
            a = abs(dist_2_points(x1=closest_coords[0],
                                  x2=second_closest_coords[0],
                                  y1=closest_coords[1],
                                  y2=second_closest_coords[1]))

            # Distances between car and closest and second closest racing point
            b = abs(dist_2_points(x1=car_coords[0],
                                  x2=closest_coords[0],
                                  y1=car_coords[1],
                                  y2=closest_coords[1]))
            c = abs(dist_2_points(x1=car_coords[0],
                                  x2=second_closest_coords[0],
                                  y1=car_coords[1],
                                  y2=second_closest_coords[1]))

            # Calculate distance between car and racing line (goes through 2 closest racing points)
            # try-except in case a=0 (rare bug in DeepRacer)
            try:
                distance = abs(-(a**4) + 2*(a**2)*(b**2) + 2*(a**2)*(c**2) -
                               (b**4) + 2*(b**2)*(c**2) - (c**4))**0.5 / (2*a)
            except:
                distance = b

            return distance

        # Calculate which one of the closest racing points is the next one and which one the previous one
        def next_prev_racing_point(closest_coords, second_closest_coords, car_coords, heading):

            # Virtually set the car more into the heading direction
            heading_vector = [math.cos(math.radians(
                heading)), math.sin(math.radians(heading))]
            new_car_coords = [car_coords[0]+heading_vector[0],
                              car_coords[1]+heading_vector[1]]

            # Calculate distance from new car coords to 2 closest racing points
            distance_closest_coords_new = dist_2_points(x1=new_car_coords[0],
                                                        x2=closest_coords[0],
                                                        y1=new_car_coords[1],
                                                        y2=closest_coords[1])
            distance_second_closest_coords_new = dist_2_points(x1=new_car_coords[0],
                                                               x2=second_closest_coords[0],
                                                               y1=new_car_coords[1],
                                                               y2=second_closest_coords[1])

            if distance_closest_coords_new <= distance_second_closest_coords_new:
                next_point_coords = closest_coords
                prev_point_coords = second_closest_coords
            else:
                next_point_coords = second_closest_coords
                prev_point_coords = closest_coords

            return [next_point_coords, prev_point_coords]

        def racing_direction_diff(closest_coords, second_closest_coords, car_coords, heading):

            # Calculate the direction of the center line based on the closest waypoints
            next_point, prev_point = next_prev_racing_point(closest_coords,
                                                            second_closest_coords,
                                                            car_coords,
                                                            heading)

            # Calculate the direction in radius, arctan2(dy, dx), the result is (-pi, pi) in radians
            track_direction = math.atan2(
                next_point[1] - prev_point[1], next_point[0] - prev_point[0])

            # Convert to degree
            track_direction = math.degrees(track_direction)

            # Calculate the difference between the track direction and the heading direction of the car
            direction_diff = abs(track_direction - heading)
            if direction_diff > 180:
                direction_diff = 360 - direction_diff

            return direction_diff

        # Gives back indexes that lie between start and end index of a cyclical list 
        # (start index is included, end index is not)
        def indexes_cyclical(start, end, array_len):

            if end < start:
                end += array_len

            return [index % array_len for index in range(start, end)]

        # Calculate how long car would take for entire lap, if it continued like it did until now
        def projected_time(first_index, closest_index, step_count, times_list):

            # Calculate how much time has passed since start
            current_actual_time = (step_count-1) / 15

            # Calculate which indexes were already passed
            indexes_traveled = indexes_cyclical(first_index, closest_index, len(times_list))

            # Calculate how much time should have passed if car would have followed optimals
            current_expected_time = sum([times_list[i] for i in indexes_traveled])

            # Calculate how long one entire lap takes if car follows optimals
            total_expected_time = sum(times_list)

            # Calculate how long car would take for entire lap, if it continued like it did until now
            try:
                projected_time = (current_actual_time/current_expected_time) * total_expected_time
            except:
                projected_time = 9999

            return projected_time

        #################### RACING LINE ######################

        # Optimal racing line for the Spain track
        # Each row: [x,y,speed,timeFromPreviousPoint]
        racing_track = [[3.02479, 0.68623, 3.97073, 0.08253],
                        [3.32, 0.68334, 4.0, 0.0738],
                        [3.42, 0.68337, 4.0, 0.025],
                        [3.7417, 0.68349, 3.38909, 0.09492],
                        [4.02722, 0.68359, 2.72585, 0.10474],
                        [4.31147, 0.68369, 2.33607, 0.12168],
                        [4.81158, 0.68387, 2.06783, 0.24186],
                        [5.32, 0.68405, 1.86941, 0.27197],
                        [5.47598, 0.68878, 1.70994, 0.09126],
                        [5.736, 0.70731, 1.57704, 0.1653],
                        [5.98882, 0.74537, 1.46224, 0.17485],
                        [6.20916, 0.80144, 1.382, 0.16452],
                        [6.39889, 0.8734, 1.382, 0.14683],
                        [6.56243, 0.96015, 1.35917, 0.1362],
                        [6.70259, 1.06143, 1.30365, 0.13265],
                        [6.82025, 1.17759, 1.30365, 0.12683],
                        [6.91417, 1.30938, 1.3, 0.12448],
                        [6.98145, 1.4569, 1.3, 0.12472],
                        [7.02159, 1.61735, 1.3, 0.12723],
                        [7.02833, 1.78889, 1.3, 0.13206],
                        [6.99333, 1.96626, 1.3, 0.13907],
                        [6.91373, 2.14045, 1.3, 0.14732],
                        [6.78245, 2.29828, 1.56362, 0.13129],
                        [6.61515, 2.43433, 1.75048, 0.12319],
                        [6.42137, 2.54558, 2.0156, 0.11086],
                        [6.21092, 2.63354, 2.43017, 0.09386],
                        [5.99148, 2.70347, 3.03386, 0.07591],
                        [5.76812, 2.76298, 2.35793, 0.09803],
                        [5.56376, 2.81524, 2.35793, 0.08946],
                        [5.36073, 2.87143, 2.35793, 0.08934],
                        [5.15964, 2.93361, 2.35793, 0.08927],
                        [4.96099, 3.00393, 2.35793, 0.08937],
                        [4.7652, 3.08485, 2.35793, 0.08985],
                        [4.57352, 3.18431, 2.66273, 0.0811],
                        [4.38495, 3.29941, 3.09022, 0.07149],
                        [4.1989, 3.42689, 3.06356, 0.07362],
                        [4.01465, 3.56294, 2.82037, 0.08121],
                        [3.83138, 3.70353, 2.61541, 0.08832],
                        [3.67997, 3.81406, 2.45304, 0.07642],
                        [3.5275, 3.91879, 2.32304, 0.07963],
                        [3.37347, 4.01659, 2.20027, 0.08292],
                        [3.21726, 4.10648, 2.08687, 0.08636],
                        [3.05809, 4.1876, 1.97825, 0.09031],
                        [2.89493, 4.25903, 1.87099, 0.09519],
                        [2.7264, 4.31974, 1.7606, 0.10175],
                        [2.55061, 4.36844, 1.66067, 0.10984],
                        [2.36477, 4.40299, 1.56695, 0.12064],
                        [2.16462, 4.41964, 1.46636, 0.13696],
                        [1.94375, 4.41113, 1.46636, 0.15074],
                        [1.69447, 4.36281, 1.46636, 0.17316],
                        [1.4232, 4.25109, 1.46636, 0.20007],
                        [1.16728, 4.05992, 1.46636, 0.21784],
                        [0.96884, 3.78558, 1.46636, 0.2309],
                        [0.8772, 3.44168, 1.97721, 0.18],
                        [0.85682, 3.10572, 2.31426, 0.14544],
                        [0.87718, 2.81861, 2.273, 0.12663],
                        [0.91349, 2.57301, 2.03551, 0.12197],
                        [0.96281, 2.3105, 1.84725, 0.1446],
                        [1.00879, 2.10306, 1.69223, 0.12556],
                        [1.0638, 1.90177, 1.55926, 0.13383],
                        [1.13183, 1.70682, 1.55926, 0.13242],
                        [1.2139, 1.52514, 1.55926, 0.12786],
                        [1.30962, 1.36176, 1.55926, 0.12144],
                        [1.41921, 1.21825, 1.55926, 0.11581],
                        [1.5451, 1.09421, 1.55926, 0.11334],
                        [1.69557, 0.98886, 1.80515, 0.10176],
                        [1.87439, 0.89629, 1.99611, 0.10088],
                        [2.09155, 0.81573, 2.23524, 0.10362],
                        [2.36273, 0.74937, 2.5689, 0.10868],
                        [2.69756, 0.70402, 3.0551, 0.1106]]

        ################## INPUT PARAMETERS ###################

        # Read all input parameters
        all_wheels_on_track = params['all_wheels_on_track']
        x = params['x']
        y = params['y']
        distance_from_center = params['distance_from_center']
        is_left_of_center = params['is_left_of_center']
        heading = params['heading']
        progress = params['progress']
        steps = params['steps']
        speed = params['speed']
        steering_angle = params['steering_angle']
        track_width = params['track_width']
        waypoints = params['waypoints']
        closest_waypoints = params['closest_waypoints']
        is_offtrack = params['is_offtrack']

        ############### OPTIMAL X,Y,SPEED,TIME ################

        # Get closest indexes for racing line (and distances to all points on racing line)
        closest_index, second_closest_index = closest_2_racing_points_index(
            racing_track, [x, y])

        # Get optimal [x, y, speed, time] for closest and second closest index
        optimals = racing_track[closest_index]
        optimals_second = racing_track[second_closest_index]

        # Save first racingpoint of episode for later
        if self.verbose == True:
            self.first_racingpoint_index = 0 # this is just for testing purposes
        if steps == 1:
            self.first_racingpoint_index = closest_index

        ################ REWARD AND PUNISHMENT ################

        ## Define the default reward ##
        reward = 1

        ## Reward if car goes close to optimal racing line ##
        DISTANCE_MULTIPLE = 1
        dist = dist_to_racing_line(optimals[0:2], optimals_second[0:2], [x, y])
        distance_reward = max(1e-3, 1 - (dist/(track_width*0.5)))
        reward += distance_reward * DISTANCE_MULTIPLE
        
        SPEED_MULTIPLE = 0.0
        reward += (speed / 4.0) * SPEED_MULTIPLE
        
        ## Zero reward if off track ##
        if is_offtrack == True:
            reward = 1e-3

        ####################### VERBOSE #######################
        
        if self.verbose == True:
            print("Closest index: %i" % closest_index)
            print("Distance to racing line: %f" % dist)
            print("=== Distance reward (w/out multiple): %f ===" % (distance_reward))
            print("Optimal speed: %f" % optimals[2])
            print("Speed difference: %f" % speed_diff)
            print("=== Speed reward (w/out multiple): %f ===" % speed_reward)
            print("Direction difference: %f" % direction_diff)
            print("Predicted time: %f" % projected_time)
            print("=== Steps reward: %f ===" % steps_reward)
            print("=== Finish reward: %f ===" % finish_reward)
            
        #################### RETURN REWARD ####################
        
        # Always return a float value
        return float(reward)


reward_object = Reward() # add parameter verbose=True to get noisy output for testing


def reward_function(params):
    return reward_object.reward_function(params)
