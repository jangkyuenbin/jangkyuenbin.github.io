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
        racing_track = [[3.06856, 0.70124, 3.50474, 0.04111],
                        [3.21411, 0.69267, 3.92231, 0.03717],
                        [3.3613, 0.68739, 4.0, 0.03682],
                        [3.50969, 0.68463, 4.0, 0.0371],
                        [3.65889, 0.68362, 4.0, 0.0373],
                        [3.80856, 0.68352, 4.0, 0.03742],
                        [3.95832, 0.68357, 4.0, 0.03744],
                        [4.10808, 0.68362, 4.0, 0.03744],
                        [4.25783, 0.68367, 4.0, 0.03744],
                        [4.40759, 0.68373, 4.0, 0.03744],
                        [4.55735, 0.68378, 4.0, 0.03744],
                        [4.70711, 0.68384, 4.0, 0.03744],
                        [4.85687, 0.68389, 3.47511, 0.04309],
                        [5.00663, 0.68395, 2.83393, 0.05285],
                        [5.15639, 0.684, 2.45157, 0.06109],
                        [5.30615, 0.68405, 2.18496, 0.06854],
                        [5.45591, 0.68412, 1.99759, 0.07497],
                        [5.60519, 0.68639, 1.85628, 0.08043],
                        [5.75334, 0.69303, 1.74369, 0.08505],
                        [5.89946, 0.70607, 1.65289, 0.08875],
                        [6.04243, 0.72727, 1.58343, 0.09128],
                        [6.18088, 0.75813, 1.52661, 0.09292],
                        [6.31327, 0.79964, 1.48029, 0.09373],
                        [6.43799, 0.85229, 1.44551, 0.09365],
                        [6.55335, 0.91608, 1.42112, 0.09276],
                        [6.65775, 0.99054, 1.40621, 0.0912],
                        [6.74981, 1.07476, 1.4, 0.08912],
                        [6.82836, 1.16748, 1.4, 0.0868],
                        [6.89247, 1.26726, 1.4, 0.08472],
                        [6.9415, 1.37251, 1.4, 0.08294],
                        [6.9751, 1.48157, 1.4, 0.08151],
                        [6.99315, 1.59278, 1.4, 0.08048],
                        [6.99575, 1.70455, 1.40458, 0.07959],
                        [6.98318, 1.81536, 1.41595, 0.07876],
                        [6.95585, 1.92382, 1.43813, 0.07777],
                        [6.91429, 2.02863, 1.47054, 0.07667],
                        [6.85916, 2.12866, 1.51661, 0.07531],
                        [6.79125, 2.22295, 1.57684, 0.07369],
                        [6.71148, 2.31072, 1.65241, 0.07178],
                        [6.62084, 2.39142, 1.74678, 0.06948],
                        [6.5204, 2.46476, 1.86534, 0.06667],
                        [6.41129, 2.5307, 2.01728, 0.06319],
                        [6.29474, 2.58953, 2.22199, 0.05876],
                        [6.172, 2.64188, 2.50077, 0.05336],
                        [6.04437, 2.68867, 2.93507, 0.04631],
                        [5.91318, 2.73115, 3.72159, 0.03705],
                        [5.77978, 2.77083, 3.73029, 0.03731],
                        [5.64557, 2.81218, 3.67029, 0.03826],
                        [5.51217, 2.8553, 3.64919, 0.03842],
                        [5.37976, 2.9006, 3.64919, 0.03835],
                        [5.24853, 2.94844, 3.64919, 0.03828],
                        [5.11862, 2.99911, 3.64919, 0.03821],
                        [4.99013, 3.05283, 3.64919, 0.03816],
                        [4.86312, 3.10967, 3.64919, 0.03813],
                        [4.73761, 3.16967, 3.68047, 0.0378],
                        [4.61359, 3.23276, 3.74651, 0.03714],
                        [4.49102, 3.29884, 3.85332, 0.03614],
                        [4.36983, 3.36774, 4.0, 0.03485],
                        [4.24993, 3.43925, 4.0, 0.0349],
                        [4.13121, 3.51312, 4.0, 0.03496],
                        [4.01355, 3.58908, 3.74426, 0.0374],
                        [3.89683, 3.66687, 3.20078, 0.04382],
                        [3.78091, 3.74621, 2.84113, 0.04944],
                        [3.66566, 3.82682, 2.58543, 0.0544],
                        [3.55187, 3.90779, 2.3974, 0.05825],
                        [3.43712, 3.98685, 2.25287, 0.06186],
                        [3.32087, 4.06294, 2.13545, 0.06506],
                        [3.20257, 4.13497, 2.04232, 0.06782],
                        [3.08173, 4.20189, 1.96815, 0.07018],
                        [2.9579, 4.26264, 1.90253, 0.0725],
                        [2.83073, 4.31618, 1.85209, 0.0745],
                        [2.70003, 4.36138, 1.8126, 0.0763],
                        [2.56591, 4.39706, 1.78039, 0.07795],
                        [2.42898, 4.42196, 1.75887, 0.07913],
                        [2.29048, 4.43495, 1.74334, 0.07979],
                        [2.15224, 4.43514, 1.73504, 0.07967],
                        [2.01642, 4.42222, 1.73504, 0.07864],
                        [1.88503, 4.39644, 1.73504, 0.07717],
                        [1.75968, 4.35846, 1.73504, 0.07549],
                        [1.64146, 4.30918, 1.73504, 0.07382],
                        [1.53102, 4.24954, 1.73504, 0.07234],
                        [1.42879, 4.1804, 1.73781, 0.07102],
                        [1.33495, 4.1026, 1.7437, 0.06991],
                        [1.24965, 4.0168, 1.76104, 0.0687],
                        [1.17295, 3.92365, 1.78473, 0.06761],
                        [1.1049, 3.82369, 1.8164, 0.06657],
                        [1.04556, 3.71741, 1.85544, 0.0656],
                        [0.99497, 3.60526, 1.90126, 0.06471],
                        [0.95318, 3.48766, 1.95793, 0.06374],
                        [0.92024, 3.36501, 2.01201, 0.06312],
                        [0.89624, 3.23766, 2.08094, 0.06227],
                        [0.88123, 3.10601, 2.1566, 0.06144],
                        [0.87524, 2.97046, 2.24077, 0.06055],
                        [0.87824, 2.83142, 2.32921, 0.05971],
                        [0.89019, 2.68937, 2.42183, 0.05886],
                        [0.91101, 2.54483, 2.36277, 0.0618],
                        [0.94049, 2.39854, 2.30663, 0.06469],
                        [0.97701, 2.25608, 2.25266, 0.06529],
                        [1.02013, 2.11903, 2.20164, 0.06526],
                        [1.06965, 1.98755, 2.14849, 0.06539],
                        [1.1254, 1.86177, 2.09828, 0.06557],
                        [1.18724, 1.74179, 2.04394, 0.06604],
                        [1.25505, 1.62771, 1.98247, 0.06694],
                        [1.32875, 1.51969, 1.98247, 0.06596],
                        [1.40829, 1.41788, 1.98247, 0.06517],
                        [1.49367, 1.32251, 1.98247, 0.06457],
                        [1.58493, 1.23385, 1.98247, 0.06418],
                        [1.68216, 1.15231, 1.98247, 0.06401],
                        [1.78556, 1.07847, 2.05381, 0.06187],
                        [1.89461, 1.01197, 2.12971, 0.05997],
                        [2.00886, 0.95255, 2.21125, 0.05824],
                        [2.12792, 0.89996, 2.30194, 0.05655],
                        [2.25146, 0.85395, 2.39872, 0.05496],
                        [2.37914, 0.8143, 2.50881, 0.05329],
                        [2.51067, 0.78077, 2.63625, 0.05149],
                        [2.64572, 0.75307, 2.78123, 0.04957],
                        [2.78396, 0.73088, 2.96774, 0.04718],
                        [2.92504, 0.71378, 3.20367, 0.04436]]

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

        ## Reward if speed is close to optimal speed ##
        SPEED_DIFF_NO_REWARD = 1
        SPEED_MULTIPLE = 4
        speed_diff = abs(optimals[2]-speed)
        if speed_diff <= SPEED_DIFF_NO_REWARD:
            # we use quadratic punishment (not linear) bc we're not as confident with the optimal speed
            # so, we do not punish small deviations from optimal speed
            speed_reward = (1 - (speed_diff/(SPEED_DIFF_NO_REWARD))**2)**2
        else:
            speed_reward = 0
        reward += speed_reward * SPEED_MULTIPLE

        # Reward if less steps
        REWARD_PER_STEP_FOR_FASTEST_TIME = 1 
        STANDARD_TIME = 10.0
        FASTEST_TIME = 8.0
        times_list = [row[3] for row in racing_track]
        projected_time = projected_time(self.first_racingpoint_index, closest_index, steps, times_list)
        try:
            steps_prediction = projected_time * 15 + 1
            reward_prediction = max(1e-3, (-REWARD_PER_STEP_FOR_FASTEST_TIME*(FASTEST_TIME) /
                                           (STANDARD_TIME-FASTEST_TIME))*(steps_prediction-(STANDARD_TIME*15+1)))
            steps_reward = min(REWARD_PER_STEP_FOR_FASTEST_TIME, reward_prediction / steps_prediction)
        except:
            steps_reward = 0
        reward += steps_reward

        # Zero reward if obviously wrong direction (e.g. spin)
        direction_diff = racing_direction_diff(
            optimals[0:2], optimals_second[0:2], [x, y], heading)
        if direction_diff > 30:
            reward = 1e-3
            
        # Zero reward of obviously too slow
        speed_diff_zero = optimals[2]-speed
        if speed_diff_zero > 0.5:
            reward = 1e-3
            
        ## Incentive for finishing the lap in less steps ##
        REWARD_FOR_FASTEST_TIME = 1000 # should be adapted to track length and other rewards
        STANDARD_TIME = 10.0  # seconds (time that is easily done by model)
        FASTEST_TIME = 8.0  # seconds (best time of 1st place on the track)
        if progress == 100:
            finish_reward = max(1e-3, (-REWARD_FOR_FASTEST_TIME /
                      (15*(STANDARD_TIME-FASTEST_TIME)))*(steps-STANDARD_TIME*15))
        else:
            finish_reward = 0
        reward += finish_reward
        
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
