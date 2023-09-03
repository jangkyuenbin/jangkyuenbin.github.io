# Metrics Analysis

This notebook has been created to enable easy monitoring of the training progress by providing graphical charts similar to the chart shown in the DeepRacer Console. It integrates directly with S3, so it is easy to reload to get updated charts.

## Usage

Out of the box the file will only need the bucket and prefix of your model to load in the data. If you run S3 locally (using minio) some additional parameters are required. Examples are listed below.

Since this file can change in the future, I recommend that you make its copy and reorganize it to your liking. This way you will not lose your changes and you'll be able to add things as you please.

## Contributions

As usual, your ideas are very welcome and encouraged so if you have any suggestions either bring them to [the AWS DeepRacer Community](http://join.deepracing.io) or share as code contributions.

## Requirements

Before you start using the notebook, you will need to install some dependencies. If you haven't yet done so, have a look at [The README.md file](/edit/README.md#running-the-notebooks) to find what you need to install.

Apart from the install, you also have to configure your programmatic access to AWS. Have a look at the guides below, AWS resources will lead you by the hand:

AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html

Boto Configuration: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html

## Imports

Run the imports block below:


```python
from deepracer.logs import metrics
import matplotlib.pyplot as plt
import numpy as np

NUM_ROUNDS=1
```

## Core configuration


```python
PREFIX='rl-deepracer-online1-3h_online12-1h'
BUCKET='bucket'
```

## Loading data

### Basic setup

The basic setup covers loading in data from one single prefix, with one single worker. Data is stored in 'real' S3.


```python
# tm = metrics.TrainingMetrics(BUCKET, model_name=PREFIX)
```

### Local minio setup
If you run training locally you will need to add a few parameters


```python
tm = metrics.TrainingMetrics(BUCKET, model_name=PREFIX, profile='minio', s3_endpoint_url='http://minio:9000')
```

    Successfully loaded training round 1 for worker 0: Iterations: 34, Training episodes: 339, Evaluation episodes: 200


### Advanced setup

In the advanced setup we can load in multiple (cloned) training sessions in sequence to show progress end-to-end even if the training was stopped and restarted/cloned. Furthermore it is possible to load in training sessions with more than one worker (i.e. more than one Robomaker). 

The recommended way to do this is to have a naming convention for the training sessions (e.g. MyModel-1, MyModel-2). The below loading lines require this.

You start by configuring a matrix where the parameters of each session. The first parameter is the training round (e.g. 1, 2, 3) and the second is the number of workers.


```python
rounds=np.array([[1,1]])
```

Load in the models. You will be given a brief statistic of what has been loaded.


```python
NUM_ROUNDS=rounds.shape[0]
# tm = metrics.TrainingMetrics(BUCKET)
tm = metrics.TrainingMetrics(BUCKET, profile="minio", s3_endpoint_url="http://minio:9000")

for r in rounds:
    tm.addRound('{}'.format(PREFIX, r[0]), training_round=r[0], workers=r[1])
```

    Successfully loaded training round 1 for worker 0: Iterations: 34, Training episodes: 339, Evaluation episodes: 200


## Analysis

The first analysis we will do is to display the basic statistics of the last 5 iterations.


```python
summary=tm.getSummary(method='mean', summary_index=['r-i','master_iteration'])
summary[-5:]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>train_reward</th>
      <th>train_completion</th>
      <th>train_time</th>
      <th>train_completed</th>
      <th>train_episodes</th>
      <th>eval_reward</th>
      <th>eval_completion</th>
      <th>eval_time</th>
      <th>eval_completed</th>
      <th>eval_episodes</th>
    </tr>
    <tr>
      <th>r-i</th>
      <th>master_iteration</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>01-029</th>
      <th>29</th>
      <td>190.100000</td>
      <td>43.2</td>
      <td>3.768000</td>
      <td>0.0</td>
      <td>10</td>
      <td>86.625</td>
      <td>21.250000</td>
      <td>1.984250</td>
      <td>0.0</td>
      <td>8.0</td>
    </tr>
    <tr>
      <th>01-030</th>
      <th>30</th>
      <td>125.100000</td>
      <td>25.6</td>
      <td>2.511900</td>
      <td>0.0</td>
      <td>10</td>
      <td>303.000</td>
      <td>66.000000</td>
      <td>5.646833</td>
      <td>0.0</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-031</th>
      <th>31</th>
      <td>151.100000</td>
      <td>32.7</td>
      <td>2.895700</td>
      <td>0.0</td>
      <td>10</td>
      <td>108.000</td>
      <td>28.833333</td>
      <td>2.580000</td>
      <td>0.0</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-032</th>
      <th>32</th>
      <td>264.100000</td>
      <td>38.6</td>
      <td>3.471400</td>
      <td>0.1</td>
      <td>10</td>
      <td>281.500</td>
      <td>59.333333</td>
      <td>5.143333</td>
      <td>0.0</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-033</th>
      <th>33</th>
      <td>189.333333</td>
      <td>44.0</td>
      <td>3.551556</td>
      <td>0.0</td>
      <td>9</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>




```python
train=tm.getTraining()
ev=tm.getEvaluation()

print("Latest iteration: %s / master %i" % (max(train['r-i']),max(train['master_iteration'])))
print("Episodes: %i" % len(train))
```

    Latest iteration: 01-033 / master 33
    Episodes: 339


### Plotting progress (AWS console style)


```python
train_data = train.groupby("iteration").agg({'reward':'mean','completion':'mean'})
ev_data = ev.groupby("iteration").agg({'reward':'mean','completion':'mean'})
y1 = np.array(train_data)[:,0]
y2 = np.array(train_data)[:,1]
y3 = np.array(ev_data)[:,1]
x = np.array(range(len(y1))) * 2

fig = plt.figure()
ax1 = fig.add_subplot(111)
ax1.plot(x,y1,'o-',color = 'g',label="Average reward (Training)")
ax1.set_ylabel('Reward')
ax1.set_title("Iteration")

ax2 = ax1.twinx()  # this is the important function
ax2.plot(np.array(range(len(y3))) * 2, y3,'s-',color = 'r',label="Average percentage completion (Evaluating)")
ax2.plot(x,y2,'d-',color = 'b',label="Average percentage completion (Training)")
ax2.set_xlim([-1, max([len(y1), len(y2)]) * 2])
ax2.set_ylim([0, 101])
ax2.set_ylabel('Percentage track completion')
ax2.set_xlabel('Iteration')

plt.show()
```


    
![png](output_17_0.png)
    


### Plotting progress

The next command will display the desired progress chart. It shows the data per iteration (dots), and a rolling average to allow the user to easily spot a trend. 

One can control the number of charts to show, based on which metric one wants to use `min`, `max`, `median` and `mean` are some of the available options.

By altering the `rounds` parameter one can choose to not display all training rounds.


```python
tm.plotProgress(method=['median','mean','max'], rolling_average=5, figsize=(20,5), rounds=rounds[:,0])
```


    
![png](output_19_0.png)
    





    
![png](output_19_1.png)
    



### Best laps

The following rounds will show the fastest 5 training and evaluation laps.


```python
top_k = 30
train_complete_lr = train[(train['round']>(NUM_ROUNDS-1)) & (train['complete']==1)]
display(train_complete_lr.nsmallest(top_k,['time']))
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>r-i</th>
      <th>round</th>
      <th>iteration</th>
      <th>master_iteration</th>
      <th>episode</th>
      <th>r-e</th>
      <th>worker</th>
      <th>trial</th>
      <th>phase</th>
      <th>reward</th>
      <th>completion</th>
      <th>time</th>
      <th>complete</th>
      <th>start_time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>388</th>
      <td>01-024</td>
      <td>1</td>
      <td>24</td>
      <td>24</td>
      <td>245</td>
      <td>1-0245</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>1345</td>
      <td>100</td>
      <td>7.263</td>
      <td>1</td>
      <td>1623780</td>
    </tr>
    <tr>
      <th>519</th>
      <td>01-032</td>
      <td>1</td>
      <td>32</td>
      <td>32</td>
      <td>326</td>
      <td>1-0326</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>1275</td>
      <td>100</td>
      <td>7.395</td>
      <td>1</td>
      <td>2098441</td>
    </tr>
    <tr>
      <th>454</th>
      <td>01-028</td>
      <td>1</td>
      <td>28</td>
      <td>28</td>
      <td>287</td>
      <td>1-0287</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>1027</td>
      <td>100</td>
      <td>8.142</td>
      <td>1</td>
      <td>1875286</td>
    </tr>
    <tr>
      <th>102</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>67</td>
      <td>1-0067</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>348</td>
      <td>100</td>
      <td>8.330</td>
      <td>1</td>
      <td>518836</td>
    </tr>
    <tr>
      <th>232</th>
      <td>01-014</td>
      <td>1</td>
      <td>14</td>
      <td>14</td>
      <td>149</td>
      <td>1-0149</td>
      <td>0</td>
      <td>9</td>
      <td>training</td>
      <td>901</td>
      <td>100</td>
      <td>8.598</td>
      <td>1</td>
      <td>1011941</td>
    </tr>
    <tr>
      <th>37</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>26</td>
      <td>1-0026</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>705</td>
      <td>100</td>
      <td>8.798</td>
      <td>1</td>
      <td>222394</td>
    </tr>
    <tr>
      <th>22</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>17</td>
      <td>1-0017</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>453</td>
      <td>100</td>
      <td>9.538</td>
      <td>1</td>
      <td>150295</td>
    </tr>
    <tr>
      <th>6</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>7</td>
      <td>1-0007</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>452</td>
      <td>100</td>
      <td>9.541</td>
      <td>1</td>
      <td>45662</td>
    </tr>
  </tbody>
</table>
</div>



```python
eval_complete_lr = ev[(ev['round']>(NUM_ROUNDS-1)) & (ev['complete']==1)]
display(eval_complete_lr.nsmallest(top_k,['time']))
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>r-i</th>
      <th>round</th>
      <th>iteration</th>
      <th>master_iteration</th>
      <th>episode</th>
      <th>r-e</th>
      <th>worker</th>
      <th>trial</th>
      <th>phase</th>
      <th>reward</th>
      <th>completion</th>
      <th>time</th>
      <th>complete</th>
      <th>start_time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>442</th>
      <td>01-027</td>
      <td>1</td>
      <td>27</td>
      <td>27</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>914</td>
      <td>100</td>
      <td>8.498</td>
      <td>1</td>
      <td>1838384</td>
    </tr>
    <tr>
      <th>75</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>50</td>
      <td>1-0050</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>855</td>
      <td>100</td>
      <td>8.662</td>
      <td>1</td>
      <td>402502</td>
    </tr>
    <tr>
      <th>15</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>10</td>
      <td>1-0010</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>805</td>
      <td>100</td>
      <td>8.671</td>
      <td>1</td>
      <td>103762</td>
    </tr>
    <tr>
      <th>11</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>10</td>
      <td>1-0010</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>774</td>
      <td>100</td>
      <td>8.728</td>
      <td>1</td>
      <td>69175</td>
    </tr>
    <tr>
      <th>10</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>10</td>
      <td>1-0010</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>755</td>
      <td>100</td>
      <td>8.823</td>
      <td>1</td>
      <td>60261</td>
    </tr>
    <tr>
      <th>13</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>10</td>
      <td>1-0010</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>692</td>
      <td>100</td>
      <td>8.855</td>
      <td>1</td>
      <td>86035</td>
    </tr>
    <tr>
      <th>43</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>30</td>
      <td>1-0030</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>730</td>
      <td>100</td>
      <td>8.987</td>
      <td>1</td>
      <td>259505</td>
    </tr>
    <tr>
      <th>31</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>543</td>
      <td>100</td>
      <td>9.335</td>
      <td>1</td>
      <td>194994</td>
    </tr>
  </tbody>
</table>
</div>


### Best lap progression

The below plot will show how the best laps for training and evaluation changes over time. This is useful to see if your model gets faster over time.


```python
plt.figure(figsize=(15,5))
plt.title('Best lap progression')
plt.scatter(train_complete_lr['master_iteration'],train_complete_lr['time'],alpha=0.4)
plt.scatter(eval_complete_lr['master_iteration'],eval_complete_lr['time'],alpha=0.4)
plt.show()
```


    
![png](output_24_0.png)
    


### Lap progress

The below shows the completion for each training and evaluation episode.


```python
plt.figure(figsize=(15,5))
plt.title('Progress per episode')
train_r = train[train['round']==NUM_ROUNDS]
eval_r = ev[ev['round']==NUM_ROUNDS]
plt.scatter(train_r['episode'],train_r['completion'],alpha=0.5)
plt.scatter(eval_r['episode'],eval_r['completion'],c='orange',alpha=0.5)
plt.show()
```


    
![png](output_26_0.png)
    



```python
plt.figure(figsize=(15,5))
plt.title('Progress per Reward')
train_r = train[train['round']==NUM_ROUNDS]
eval_r = ev[ev['round']==NUM_ROUNDS]
plt.scatter(train_r['episode'],train_r['reward'],alpha=0.5)
plt.scatter(eval_r['episode'],eval_r['reward'],c='orange',alpha=0.5)
plt.show()
```


    
![png](output_27_0.png)
    

