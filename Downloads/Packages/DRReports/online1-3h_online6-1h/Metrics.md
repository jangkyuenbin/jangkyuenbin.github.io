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
PREFIX='rl-deepracer-online1-3h_online6-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 22, Training episodes: 423, Evaluation episodes: 137


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

    Successfully loaded training round 1 for worker 0: Iterations: 22, Training episodes: 423, Evaluation episodes: 137


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
      <th>01-017</th>
      <th>17</th>
      <td>123.80</td>
      <td>31.200000</td>
      <td>3.096400</td>
      <td>0.0</td>
      <td>20</td>
      <td>132.285714</td>
      <td>33.571429</td>
      <td>3.351429</td>
      <td>0.000000</td>
      <td>7.0</td>
    </tr>
    <tr>
      <th>01-018</th>
      <th>18</th>
      <td>124.65</td>
      <td>31.700000</td>
      <td>3.000600</td>
      <td>0.0</td>
      <td>20</td>
      <td>143.666667</td>
      <td>34.833333</td>
      <td>3.500167</td>
      <td>0.000000</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-019</th>
      <th>19</th>
      <td>155.25</td>
      <td>41.900000</td>
      <td>3.961350</td>
      <td>0.0</td>
      <td>20</td>
      <td>208.428571</td>
      <td>39.142857</td>
      <td>3.788143</td>
      <td>0.142857</td>
      <td>7.0</td>
    </tr>
    <tr>
      <th>01-020</th>
      <th>20</th>
      <td>145.70</td>
      <td>36.900000</td>
      <td>3.596750</td>
      <td>0.0</td>
      <td>20</td>
      <td>190.166667</td>
      <td>47.500000</td>
      <td>4.631833</td>
      <td>0.000000</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-021</th>
      <th>21</th>
      <td>164.00</td>
      <td>42.666667</td>
      <td>4.402333</td>
      <td>0.0</td>
      <td>3</td>
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

    Latest iteration: 01-021 / master 21
    Episodes: 423


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
      <th>58</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>47</td>
      <td>1-0047</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>865</td>
      <td>100</td>
      <td>8.335</td>
      <td>1</td>
      <td>346728</td>
    </tr>
    <tr>
      <th>404</th>
      <td>01-015</td>
      <td>1</td>
      <td>15</td>
      <td>15</td>
      <td>306</td>
      <td>1-0306</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>920</td>
      <td>100</td>
      <td>8.405</td>
      <td>1</td>
      <td>1625655</td>
    </tr>
    <tr>
      <th>373</th>
      <td>01-014</td>
      <td>1</td>
      <td>14</td>
      <td>14</td>
      <td>281</td>
      <td>1-0281</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>856</td>
      <td>100</td>
      <td>8.413</td>
      <td>1</td>
      <td>1521245</td>
    </tr>
    <tr>
      <th>138</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>107</td>
      <td>1-0107</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>810</td>
      <td>100</td>
      <td>8.453</td>
      <td>1</td>
      <td>730386</td>
    </tr>
    <tr>
      <th>116</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>91</td>
      <td>1-0091</td>
      <td>0</td>
      <td>11</td>
      <td>training</td>
      <td>743</td>
      <td>100</td>
      <td>8.731</td>
      <td>1</td>
      <td>623635</td>
    </tr>
    <tr>
      <th>186</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>141</td>
      <td>1-0141</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>661</td>
      <td>100</td>
      <td>8.866</td>
      <td>1</td>
      <td>912925</td>
    </tr>
    <tr>
      <th>5</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>6</td>
      <td>1-0006</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>743</td>
      <td>100</td>
      <td>8.868</td>
      <td>1</td>
      <td>41747</td>
    </tr>
    <tr>
      <th>11</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>12</td>
      <td>1-0012</td>
      <td>0</td>
      <td>12</td>
      <td>training</td>
      <td>684</td>
      <td>100</td>
      <td>8.868</td>
      <td>1</td>
      <td>87081</td>
    </tr>
    <tr>
      <th>33</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>28</td>
      <td>1-0028</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>635</td>
      <td>100</td>
      <td>9.083</td>
      <td>1</td>
      <td>202111</td>
    </tr>
    <tr>
      <th>81</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>62</td>
      <td>1-0062</td>
      <td>0</td>
      <td>2</td>
      <td>training</td>
      <td>528</td>
      <td>100</td>
      <td>9.275</td>
      <td>1</td>
      <td>471858</td>
    </tr>
    <tr>
      <th>52</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>41</td>
      <td>1-0041</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>509</td>
      <td>100</td>
      <td>9.327</td>
      <td>1</td>
      <td>325397</td>
    </tr>
    <tr>
      <th>132</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>101</td>
      <td>1-0101</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>491</td>
      <td>100</td>
      <td>9.338</td>
      <td>1</td>
      <td>707639</td>
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
      <td>549</td>
      <td>100</td>
      <td>9.351</td>
      <td>1</td>
      <td>50689</td>
    </tr>
    <tr>
      <th>35</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>30</td>
      <td>1-0030</td>
      <td>0</td>
      <td>10</td>
      <td>training</td>
      <td>564</td>
      <td>100</td>
      <td>9.363</td>
      <td>1</td>
      <td>220846</td>
    </tr>
    <tr>
      <th>34</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>29</td>
      <td>1-0029</td>
      <td>0</td>
      <td>9</td>
      <td>training</td>
      <td>497</td>
      <td>100</td>
      <td>9.536</td>
      <td>1</td>
      <td>211249</td>
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
      <th>182</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>935</td>
      <td>100</td>
      <td>8.338</td>
      <td>1</td>
      <td>893924</td>
    </tr>
    <tr>
      <th>131</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>100</td>
      <td>1-0100</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>859</td>
      <td>100</td>
      <td>8.538</td>
      <td>1</td>
      <td>699033</td>
    </tr>
    <tr>
      <th>25</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>851</td>
      <td>100</td>
      <td>8.547</td>
      <td>1</td>
      <td>164512</td>
    </tr>
    <tr>
      <th>105</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>802</td>
      <td>100</td>
      <td>8.669</td>
      <td>1</td>
      <td>591226</td>
    </tr>
    <tr>
      <th>530</th>
      <td>01-019</td>
      <td>1</td>
      <td>19</td>
      <td>19</td>
      <td>400</td>
      <td>1-0400</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>774</td>
      <td>100</td>
      <td>8.797</td>
      <td>1</td>
      <td>2035180</td>
    </tr>
    <tr>
      <th>48</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>684</td>
      <td>100</td>
      <td>8.939</td>
      <td>1</td>
      <td>297990</td>
    </tr>
    <tr>
      <th>24</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>678</td>
      <td>100</td>
      <td>8.944</td>
      <td>1</td>
      <td>155526</td>
    </tr>
    <tr>
      <th>77</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>60</td>
      <td>1-0060</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>664</td>
      <td>100</td>
      <td>8.995</td>
      <td>1</td>
      <td>451270</td>
    </tr>
    <tr>
      <th>100</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>676</td>
      <td>100</td>
      <td>9.007</td>
      <td>1</td>
      <td>562006</td>
    </tr>
    <tr>
      <th>127</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>100</td>
      <td>1-0100</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>643</td>
      <td>100</td>
      <td>9.121</td>
      <td>1</td>
      <td>676993</td>
    </tr>
    <tr>
      <th>181</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>623</td>
      <td>100</td>
      <td>9.250</td>
      <td>1</td>
      <td>884599</td>
    </tr>
    <tr>
      <th>103</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>594</td>
      <td>100</td>
      <td>9.281</td>
      <td>1</td>
      <td>578329</td>
    </tr>
    <tr>
      <th>50</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>605</td>
      <td>100</td>
      <td>9.285</td>
      <td>1</td>
      <td>311572</td>
    </tr>
    <tr>
      <th>47</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>556</td>
      <td>100</td>
      <td>9.357</td>
      <td>1</td>
      <td>288589</td>
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
    

