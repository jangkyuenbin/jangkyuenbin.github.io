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
PREFIX='rl-deepracer-online1-3h_online7-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 9, Training episodes: 325, Evaluation episodes: 56


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

    Successfully loaded training round 1 for worker 0: Iterations: 9, Training episodes: 325, Evaluation episodes: 56


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
      <th>01-004</th>
      <th>4</th>
      <td>254.725</td>
      <td>55.150</td>
      <td>5.364825</td>
      <td>0.200</td>
      <td>40</td>
      <td>359.000000</td>
      <td>62.000000</td>
      <td>5.922750</td>
      <td>0.375000</td>
      <td>8.0</td>
    </tr>
    <tr>
      <th>01-005</th>
      <th>5</th>
      <td>259.925</td>
      <td>54.675</td>
      <td>5.320700</td>
      <td>0.200</td>
      <td>40</td>
      <td>391.000000</td>
      <td>63.285714</td>
      <td>5.908286</td>
      <td>0.428571</td>
      <td>7.0</td>
    </tr>
    <tr>
      <th>01-006</th>
      <th>6</th>
      <td>258.900</td>
      <td>59.775</td>
      <td>5.780525</td>
      <td>0.225</td>
      <td>40</td>
      <td>552.500000</td>
      <td>89.166667</td>
      <td>8.187000</td>
      <td>0.833333</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-007</th>
      <th>7</th>
      <td>306.375</td>
      <td>61.250</td>
      <td>5.811950</td>
      <td>0.250</td>
      <td>40</td>
      <td>580.666667</td>
      <td>84.833333</td>
      <td>7.547833</td>
      <td>0.666667</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-008</th>
      <th>8</th>
      <td>301.600</td>
      <td>53.400</td>
      <td>5.266800</td>
      <td>0.400</td>
      <td>5</td>
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

    Latest iteration: 01-008 / master 8
    Episodes: 325


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
      <th>195</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>167</td>
      <td>1-0167</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>979</td>
      <td>100</td>
      <td>8.141</td>
      <td>1</td>
      <td>1123648</td>
    </tr>
    <tr>
      <th>262</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>226</td>
      <td>1-0226</td>
      <td>0</td>
      <td>26</td>
      <td>training</td>
      <td>891</td>
      <td>100</td>
      <td>8.295</td>
      <td>1</td>
      <td>1495135</td>
    </tr>
    <tr>
      <th>98</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>86</td>
      <td>1-0086</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>903</td>
      <td>100</td>
      <td>8.341</td>
      <td>1</td>
      <td>555142</td>
    </tr>
    <tr>
      <th>342</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>293</td>
      <td>1-0293</td>
      <td>0</td>
      <td>13</td>
      <td>training</td>
      <td>837</td>
      <td>100</td>
      <td>8.473</td>
      <td>1</td>
      <td>1961514</td>
    </tr>
    <tr>
      <th>26</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>27</td>
      <td>1-0027</td>
      <td>0</td>
      <td>27</td>
      <td>training</td>
      <td>793</td>
      <td>100</td>
      <td>8.545</td>
      <td>1</td>
      <td>153447</td>
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
      <td>802</td>
      <td>100</td>
      <td>8.600</td>
      <td>1</td>
      <td>41853</td>
    </tr>
    <tr>
      <th>334</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>285</td>
      <td>1-0285</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>811</td>
      <td>100</td>
      <td>8.600</td>
      <td>1</td>
      <td>1913519</td>
    </tr>
    <tr>
      <th>221</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>193</td>
      <td>1-0193</td>
      <td>0</td>
      <td>33</td>
      <td>training</td>
      <td>808</td>
      <td>100</td>
      <td>8.603</td>
      <td>1</td>
      <td>1268651</td>
    </tr>
    <tr>
      <th>74</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>68</td>
      <td>1-0068</td>
      <td>0</td>
      <td>28</td>
      <td>training</td>
      <td>742</td>
      <td>100</td>
      <td>8.672</td>
      <td>1</td>
      <td>424947</td>
    </tr>
    <tr>
      <th>263</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>227</td>
      <td>1-0227</td>
      <td>0</td>
      <td>27</td>
      <td>training</td>
      <td>805</td>
      <td>100</td>
      <td>8.674</td>
      <td>1</td>
      <td>1503490</td>
    </tr>
    <tr>
      <th>100</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>88</td>
      <td>1-0088</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>312</td>
      <td>100</td>
      <td>8.728</td>
      <td>1</td>
      <td>572423</td>
    </tr>
    <tr>
      <th>51</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>45</td>
      <td>1-0045</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>788</td>
      <td>100</td>
      <td>8.733</td>
      <td>1</td>
      <td>310148</td>
    </tr>
    <tr>
      <th>34</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>35</td>
      <td>1-0035</td>
      <td>0</td>
      <td>35</td>
      <td>training</td>
      <td>747</td>
      <td>100</td>
      <td>8.760</td>
      <td>1</td>
      <td>214916</td>
    </tr>
    <tr>
      <th>70</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>64</td>
      <td>1-0064</td>
      <td>0</td>
      <td>24</td>
      <td>training</td>
      <td>735</td>
      <td>100</td>
      <td>8.793</td>
      <td>1</td>
      <td>408490</td>
    </tr>
    <tr>
      <th>99</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>87</td>
      <td>1-0087</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>752</td>
      <td>100</td>
      <td>8.803</td>
      <td>1</td>
      <td>563550</td>
    </tr>
    <tr>
      <th>310</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>267</td>
      <td>1-0267</td>
      <td>0</td>
      <td>27</td>
      <td>training</td>
      <td>747</td>
      <td>100</td>
      <td>8.808</td>
      <td>1</td>
      <td>1749690</td>
    </tr>
    <tr>
      <th>343</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>294</td>
      <td>1-0294</td>
      <td>0</td>
      <td>14</td>
      <td>training</td>
      <td>733</td>
      <td>100</td>
      <td>8.823</td>
      <td>1</td>
      <td>1970053</td>
    </tr>
    <tr>
      <th>357</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>308</td>
      <td>1-0308</td>
      <td>0</td>
      <td>28</td>
      <td>training</td>
      <td>742</td>
      <td>100</td>
      <td>8.825</td>
      <td>1</td>
      <td>2048520</td>
    </tr>
    <tr>
      <th>157</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>136</td>
      <td>1-0136</td>
      <td>0</td>
      <td>16</td>
      <td>training</td>
      <td>676</td>
      <td>100</td>
      <td>8.827</td>
      <td>1</td>
      <td>903624</td>
    </tr>
    <tr>
      <th>361</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>312</td>
      <td>1-0312</td>
      <td>0</td>
      <td>32</td>
      <td>training</td>
      <td>718</td>
      <td>100</td>
      <td>8.831</td>
      <td>1</td>
      <td>2083514</td>
    </tr>
    <tr>
      <th>323</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>training</td>
      <td>660</td>
      <td>100</td>
      <td>8.854</td>
      <td>1</td>
      <td>1838906</td>
    </tr>
    <tr>
      <th>239</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>203</td>
      <td>1-0203</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>726</td>
      <td>100</td>
      <td>8.872</td>
      <td>1</td>
      <td>1366539</td>
    </tr>
    <tr>
      <th>179</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>158</td>
      <td>1-0158</td>
      <td>0</td>
      <td>38</td>
      <td>training</td>
      <td>682</td>
      <td>100</td>
      <td>8.934</td>
      <td>1</td>
      <td>1028958</td>
    </tr>
    <tr>
      <th>191</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>163</td>
      <td>1-0163</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>709</td>
      <td>100</td>
      <td>8.938</td>
      <td>1</td>
      <td>1102446</td>
    </tr>
    <tr>
      <th>149</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>128</td>
      <td>1-0128</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>689</td>
      <td>100</td>
      <td>8.940</td>
      <td>1</td>
      <td>843490</td>
    </tr>
    <tr>
      <th>338</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>289</td>
      <td>1-0289</td>
      <td>0</td>
      <td>9</td>
      <td>training</td>
      <td>700</td>
      <td>100</td>
      <td>8.944</td>
      <td>1</td>
      <td>1927784</td>
    </tr>
    <tr>
      <th>344</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>295</td>
      <td>1-0295</td>
      <td>0</td>
      <td>15</td>
      <td>training</td>
      <td>668</td>
      <td>100</td>
      <td>8.947</td>
      <td>1</td>
      <td>1978924</td>
    </tr>
    <tr>
      <th>317</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>274</td>
      <td>1-0274</td>
      <td>0</td>
      <td>34</td>
      <td>training</td>
      <td>657</td>
      <td>100</td>
      <td>8.962</td>
      <td>1</td>
      <td>1810226</td>
    </tr>
    <tr>
      <th>351</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>302</td>
      <td>1-0302</td>
      <td>0</td>
      <td>22</td>
      <td>training</td>
      <td>648</td>
      <td>100</td>
      <td>9.003</td>
      <td>1</td>
      <td>2018449</td>
    </tr>
    <tr>
      <th>380</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>325</td>
      <td>1-0325</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>728</td>
      <td>100</td>
      <td>9.011</td>
      <td>1</td>
      <td>2195596</td>
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
      <th>371</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>320</td>
      <td>1-0320</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>859</td>
      <td>100</td>
      <td>8.457</td>
      <td>1</td>
      <td>2141200</td>
    </tr>
    <tr>
      <th>236</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>822</td>
      <td>100</td>
      <td>8.623</td>
      <td>1</td>
      <td>1348805</td>
    </tr>
    <tr>
      <th>279</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>869</td>
      <td>100</td>
      <td>8.636</td>
      <td>1</td>
      <td>1585869</td>
    </tr>
    <tr>
      <th>373</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>320</td>
      <td>1-0320</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>786</td>
      <td>100</td>
      <td>8.732</td>
      <td>1</td>
      <td>2155401</td>
    </tr>
    <tr>
      <th>329</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>773</td>
      <td>100</td>
      <td>8.745</td>
      <td>1</td>
      <td>1888783</td>
    </tr>
    <tr>
      <th>41</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>747</td>
      <td>100</td>
      <td>8.772</td>
      <td>1</td>
      <td>257346</td>
    </tr>
    <tr>
      <th>283</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>732</td>
      <td>100</td>
      <td>8.813</td>
      <td>1</td>
      <td>1605564</td>
    </tr>
    <tr>
      <th>370</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>320</td>
      <td>1-0320</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>743</td>
      <td>100</td>
      <td>8.890</td>
      <td>1</td>
      <td>2132256</td>
    </tr>
    <tr>
      <th>88</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>728</td>
      <td>100</td>
      <td>8.899</td>
      <td>1</td>
      <td>500222</td>
    </tr>
    <tr>
      <th>374</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>320</td>
      <td>1-0320</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>714</td>
      <td>100</td>
      <td>8.978</td>
      <td>1</td>
      <td>2164225</td>
    </tr>
    <tr>
      <th>89</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>657</td>
      <td>100</td>
      <td>8.984</td>
      <td>1</td>
      <td>509231</td>
    </tr>
    <tr>
      <th>235</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>645</td>
      <td>100</td>
      <td>9.022</td>
      <td>1</td>
      <td>1339738</td>
    </tr>
    <tr>
      <th>185</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>670</td>
      <td>100</td>
      <td>9.049</td>
      <td>1</td>
      <td>1065319</td>
    </tr>
    <tr>
      <th>233</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>658</td>
      <td>100</td>
      <td>9.085</td>
      <td>1</td>
      <td>1326681</td>
    </tr>
    <tr>
      <th>141</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>611</td>
      <td>100</td>
      <td>9.127</td>
      <td>1</td>
      <td>801429</td>
    </tr>
    <tr>
      <th>277</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>599</td>
      <td>100</td>
      <td>9.128</td>
      <td>1</td>
      <td>1572679</td>
    </tr>
    <tr>
      <th>46</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>614</td>
      <td>100</td>
      <td>9.128</td>
      <td>1</td>
      <td>288658</td>
    </tr>
    <tr>
      <th>325</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>601</td>
      <td>100</td>
      <td>9.131</td>
      <td>1</td>
      <td>1857147</td>
    </tr>
    <tr>
      <th>90</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>617</td>
      <td>100</td>
      <td>9.147</td>
      <td>1</td>
      <td>518270</td>
    </tr>
    <tr>
      <th>328</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>632</td>
      <td>100</td>
      <td>9.149</td>
      <td>1</td>
      <td>1879591</td>
    </tr>
    <tr>
      <th>324</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>588</td>
      <td>100</td>
      <td>9.192</td>
      <td>1</td>
      <td>1847911</td>
    </tr>
    <tr>
      <th>327</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>597</td>
      <td>100</td>
      <td>9.226</td>
      <td>1</td>
      <td>1870297</td>
    </tr>
    <tr>
      <th>44</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>548</td>
      <td>100</td>
      <td>9.290</td>
      <td>1</td>
      <td>274685</td>
    </tr>
    <tr>
      <th>187</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>530</td>
      <td>100</td>
      <td>9.359</td>
      <td>1</td>
      <td>1078514</td>
    </tr>
    <tr>
      <th>184</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>524</td>
      <td>100</td>
      <td>9.415</td>
      <td>1</td>
      <td>1055832</td>
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
    

