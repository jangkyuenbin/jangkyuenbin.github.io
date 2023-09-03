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
PREFIX='rl-deepracer-online1-3h_online5-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 21, Training episodes: 415, Evaluation episodes: 146


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

    Successfully loaded training round 1 for worker 0: Iterations: 21, Training episodes: 415, Evaluation episodes: 146


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
      <th>01-016</th>
      <th>16</th>
      <td>167.750000</td>
      <td>34.85</td>
      <td>3.236600</td>
      <td>0.00</td>
      <td>20</td>
      <td>151.857143</td>
      <td>34.571429</td>
      <td>3.465000</td>
      <td>0.0</td>
      <td>7.0</td>
    </tr>
    <tr>
      <th>01-017</th>
      <th>17</th>
      <td>172.500000</td>
      <td>37.05</td>
      <td>3.433850</td>
      <td>0.00</td>
      <td>20</td>
      <td>134.125000</td>
      <td>30.875000</td>
      <td>3.145625</td>
      <td>0.0</td>
      <td>8.0</td>
    </tr>
    <tr>
      <th>01-018</th>
      <th>18</th>
      <td>205.500000</td>
      <td>45.15</td>
      <td>4.065950</td>
      <td>0.00</td>
      <td>20</td>
      <td>155.000000</td>
      <td>34.375000</td>
      <td>3.480000</td>
      <td>0.0</td>
      <td>8.0</td>
    </tr>
    <tr>
      <th>01-019</th>
      <th>19</th>
      <td>269.400000</td>
      <td>51.40</td>
      <td>4.485850</td>
      <td>0.05</td>
      <td>20</td>
      <td>143.800000</td>
      <td>30.700000</td>
      <td>3.100400</td>
      <td>0.0</td>
      <td>10.0</td>
    </tr>
    <tr>
      <th>01-020</th>
      <th>20</th>
      <td>264.333333</td>
      <td>57.00</td>
      <td>5.012333</td>
      <td>0.00</td>
      <td>15</td>
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

    Latest iteration: 01-020 / master 20
    Episodes: 415


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
      <th>521</th>
      <td>01-019</td>
      <td>1</td>
      <td>19</td>
      <td>19</td>
      <td>386</td>
      <td>1-0386</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>1299</td>
      <td>100</td>
      <td>7.396</td>
      <td>1</td>
      <td>2022620</td>
    </tr>
    <tr>
      <th>326</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>245</td>
      <td>1-0245</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>1242</td>
      <td>100</td>
      <td>7.594</td>
      <td>1</td>
      <td>1311764</td>
    </tr>
    <tr>
      <th>330</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>249</td>
      <td>1-0249</td>
      <td>0</td>
      <td>9</td>
      <td>training</td>
      <td>994</td>
      <td>100</td>
      <td>8.403</td>
      <td>1</td>
      <td>1328891</td>
    </tr>
    <tr>
      <th>69</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>57</td>
      <td>1-0057</td>
      <td>0</td>
      <td>17</td>
      <td>training</td>
      <td>840</td>
      <td>100</td>
      <td>8.482</td>
      <td>1</td>
      <td>408837</td>
    </tr>
    <tr>
      <th>57</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>45</td>
      <td>1-0045</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>755</td>
      <td>100</td>
      <td>8.811</td>
      <td>1</td>
      <td>334906</td>
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
      <td>690</td>
      <td>100</td>
      <td>8.861</td>
      <td>1</td>
      <td>75322</td>
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
      <td>722</td>
      <td>100</td>
      <td>8.870</td>
      <td>1</td>
      <td>44649</td>
    </tr>
    <tr>
      <th>53</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>41</td>
      <td>1-0041</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>695</td>
      <td>100</td>
      <td>8.880</td>
      <td>1</td>
      <td>314978</td>
    </tr>
    <tr>
      <th>33</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>27</td>
      <td>1-0027</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>698</td>
      <td>100</td>
      <td>8.999</td>
      <td>1</td>
      <td>194754</td>
    </tr>
    <tr>
      <th>43</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>37</td>
      <td>1-0037</td>
      <td>0</td>
      <td>17</td>
      <td>training</td>
      <td>611</td>
      <td>100</td>
      <td>9.004</td>
      <td>1</td>
      <td>248950</td>
    </tr>
    <tr>
      <th>17</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>18</td>
      <td>1-0018</td>
      <td>0</td>
      <td>18</td>
      <td>training</td>
      <td>621</td>
      <td>100</td>
      <td>9.063</td>
      <td>1</td>
      <td>113130</td>
    </tr>
    <tr>
      <th>38</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>32</td>
      <td>1-0032</td>
      <td>0</td>
      <td>12</td>
      <td>training</td>
      <td>552</td>
      <td>100</td>
      <td>9.336</td>
      <td>1</td>
      <td>217152</td>
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
      <td>584</td>
      <td>100</td>
      <td>9.341</td>
      <td>1</td>
      <td>53580</td>
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
      <td>923</td>
      <td>100</td>
      <td>8.514</td>
      <td>1</td>
      <td>536166</td>
    </tr>
    <tr>
      <th>321</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>895</td>
      <td>100</td>
      <td>8.527</td>
      <td>1</td>
      <td>1289696</td>
    </tr>
    <tr>
      <th>104</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>819</td>
      <td>100</td>
      <td>8.663</td>
      <td>1</td>
      <td>557327</td>
    </tr>
    <tr>
      <th>75</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>60</td>
      <td>1-0060</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>775</td>
      <td>100</td>
      <td>8.769</td>
      <td>1</td>
      <td>444603</td>
    </tr>
    <tr>
      <th>52</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>752</td>
      <td>100</td>
      <td>8.814</td>
      <td>1</td>
      <td>306108</td>
    </tr>
    <tr>
      <th>23</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>673</td>
      <td>100</td>
      <td>9.116</td>
      <td>1</td>
      <td>147258</td>
    </tr>
    <tr>
      <th>26</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>628</td>
      <td>100</td>
      <td>9.136</td>
      <td>1</td>
      <td>165557</td>
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
      <td>646</td>
      <td>100</td>
      <td>9.174</td>
      <td>1</td>
      <td>278623</td>
    </tr>
    <tr>
      <th>21</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>604</td>
      <td>100</td>
      <td>9.196</td>
      <td>1</td>
      <td>134086</td>
    </tr>
    <tr>
      <th>74</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>60</td>
      <td>1-0060</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>610</td>
      <td>100</td>
      <td>9.214</td>
      <td>1</td>
      <td>435331</td>
    </tr>
    <tr>
      <th>51</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>566</td>
      <td>100</td>
      <td>9.251</td>
      <td>1</td>
      <td>296796</td>
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
      <td>556</td>
      <td>100</td>
      <td>9.290</td>
      <td>1</td>
      <td>457762</td>
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
    

