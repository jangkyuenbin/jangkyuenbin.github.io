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
PREFIX='rl-deepracer-online1-3h_online9-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 8, Training episodes: 293, Evaluation episodes: 42


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

    Successfully loaded training round 1 for worker 0: Iterations: 8, Training episodes: 293, Evaluation episodes: 42


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
      <th>01-003</th>
      <th>3</th>
      <td>313.650000</td>
      <td>65.925000</td>
      <td>6.335300</td>
      <td>0.325000</td>
      <td>40</td>
      <td>518.166667</td>
      <td>81.166667</td>
      <td>7.526667</td>
      <td>0.666667</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-004</th>
      <th>4</th>
      <td>376.200000</td>
      <td>73.400000</td>
      <td>6.952000</td>
      <td>0.450000</td>
      <td>40</td>
      <td>326.000000</td>
      <td>62.333333</td>
      <td>5.978333</td>
      <td>0.333333</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-005</th>
      <th>5</th>
      <td>373.950000</td>
      <td>67.100000</td>
      <td>6.336125</td>
      <td>0.425000</td>
      <td>40</td>
      <td>633.500000</td>
      <td>90.666667</td>
      <td>8.133667</td>
      <td>0.833333</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-006</th>
      <th>6</th>
      <td>436.925000</td>
      <td>79.475000</td>
      <td>7.398025</td>
      <td>0.525000</td>
      <td>40</td>
      <td>540.666667</td>
      <td>82.166667</td>
      <td>7.486833</td>
      <td>0.666667</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-007</th>
      <th>7</th>
      <td>431.538462</td>
      <td>75.384615</td>
      <td>7.060385</td>
      <td>0.538462</td>
      <td>13</td>
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

    Latest iteration: 01-007 / master 7
    Episodes: 293


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
      <th>235</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>206</td>
      <td>1-0206</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>974</td>
      <td>100</td>
      <td>8.142</td>
      <td>1</td>
      <td>1485365</td>
    </tr>
    <tr>
      <th>300</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>265</td>
      <td>1-0265</td>
      <td>0</td>
      <td>25</td>
      <td>training</td>
      <td>942</td>
      <td>100</td>
      <td>8.336</td>
      <td>1</td>
      <td>1932929</td>
    </tr>
    <tr>
      <th>328</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>287</td>
      <td>1-0287</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>913</td>
      <td>100</td>
      <td>8.337</td>
      <td>1</td>
      <td>2153706</td>
    </tr>
    <tr>
      <th>288</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>253</td>
      <td>1-0253</td>
      <td>0</td>
      <td>13</td>
      <td>training</td>
      <td>862</td>
      <td>100</td>
      <td>8.412</td>
      <td>1</td>
      <td>1851464</td>
    </tr>
    <tr>
      <th>329</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>288</td>
      <td>1-0288</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>861</td>
      <td>100</td>
      <td>8.539</td>
      <td>1</td>
      <td>2162107</td>
    </tr>
    <tr>
      <th>116</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>105</td>
      <td>1-0105</td>
      <td>0</td>
      <td>25</td>
      <td>training</td>
      <td>847</td>
      <td>100</td>
      <td>8.544</td>
      <td>1</td>
      <td>704893</td>
    </tr>
    <tr>
      <th>221</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>198</td>
      <td>1-0198</td>
      <td>0</td>
      <td>38</td>
      <td>training</td>
      <td>811</td>
      <td>100</td>
      <td>8.544</td>
      <td>1</td>
      <td>1404115</td>
    </tr>
    <tr>
      <th>281</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>246</td>
      <td>1-0246</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>844</td>
      <td>100</td>
      <td>8.548</td>
      <td>1</td>
      <td>1797327</td>
    </tr>
    <tr>
      <th>25</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>26</td>
      <td>1-0026</td>
      <td>0</td>
      <td>26</td>
      <td>training</td>
      <td>818</td>
      <td>100</td>
      <td>8.593</td>
      <td>1</td>
      <td>152685</td>
    </tr>
    <tr>
      <th>209</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>186</td>
      <td>1-0186</td>
      <td>0</td>
      <td>26</td>
      <td>training</td>
      <td>828</td>
      <td>100</td>
      <td>8.596</td>
      <td>1</td>
      <td>1310056</td>
    </tr>
    <tr>
      <th>280</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>245</td>
      <td>1-0245</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>825</td>
      <td>100</td>
      <td>8.605</td>
      <td>1</td>
      <td>1788665</td>
    </tr>
    <tr>
      <th>4</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>5</td>
      <td>1-0005</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>789</td>
      <td>100</td>
      <td>8.669</td>
      <td>1</td>
      <td>53885</td>
    </tr>
    <tr>
      <th>80</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>75</td>
      <td>1-0075</td>
      <td>0</td>
      <td>35</td>
      <td>training</td>
      <td>770</td>
      <td>100</td>
      <td>8.678</td>
      <td>1</td>
      <td>478613</td>
    </tr>
    <tr>
      <th>257</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>228</td>
      <td>1-0228</td>
      <td>0</td>
      <td>28</td>
      <td>training</td>
      <td>783</td>
      <td>100</td>
      <td>8.717</td>
      <td>1</td>
      <td>1623841</td>
    </tr>
    <tr>
      <th>115</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>104</td>
      <td>1-0104</td>
      <td>0</td>
      <td>24</td>
      <td>training</td>
      <td>777</td>
      <td>100</td>
      <td>8.734</td>
      <td>1</td>
      <td>696093</td>
    </tr>
    <tr>
      <th>190</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>167</td>
      <td>1-0167</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>774</td>
      <td>100</td>
      <td>8.736</td>
      <td>1</td>
      <td>1171592</td>
    </tr>
    <tr>
      <th>269</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>training</td>
      <td>726</td>
      <td>100</td>
      <td>8.742</td>
      <td>1</td>
      <td>1709364</td>
    </tr>
    <tr>
      <th>202</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>179</td>
      <td>1-0179</td>
      <td>0</td>
      <td>19</td>
      <td>training</td>
      <td>722</td>
      <td>100</td>
      <td>8.747</td>
      <td>1</td>
      <td>1269047</td>
    </tr>
    <tr>
      <th>38</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>39</td>
      <td>1-0039</td>
      <td>0</td>
      <td>39</td>
      <td>training</td>
      <td>698</td>
      <td>100</td>
      <td>8.799</td>
      <td>1</td>
      <td>223953</td>
    </tr>
    <tr>
      <th>303</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>268</td>
      <td>1-0268</td>
      <td>0</td>
      <td>28</td>
      <td>training</td>
      <td>717</td>
      <td>100</td>
      <td>8.799</td>
      <td>1</td>
      <td>1959270</td>
    </tr>
    <tr>
      <th>278</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>243</td>
      <td>1-0243</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>729</td>
      <td>100</td>
      <td>8.803</td>
      <td>1</td>
      <td>1777201</td>
    </tr>
    <tr>
      <th>265</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>236</td>
      <td>1-0236</td>
      <td>0</td>
      <td>36</td>
      <td>training</td>
      <td>700</td>
      <td>100</td>
      <td>8.804</td>
      <td>1</td>
      <td>1688367</td>
    </tr>
    <tr>
      <th>164</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>147</td>
      <td>1-0147</td>
      <td>0</td>
      <td>27</td>
      <td>training</td>
      <td>724</td>
      <td>100</td>
      <td>8.867</td>
      <td>1</td>
      <td>1009176</td>
    </tr>
    <tr>
      <th>223</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>training</td>
      <td>680</td>
      <td>100</td>
      <td>8.868</td>
      <td>1</td>
      <td>1416990</td>
    </tr>
    <tr>
      <th>51</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>46</td>
      <td>1-0046</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>745</td>
      <td>100</td>
      <td>8.872</td>
      <td>1</td>
      <td>296084</td>
    </tr>
    <tr>
      <th>302</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>267</td>
      <td>1-0267</td>
      <td>0</td>
      <td>27</td>
      <td>training</td>
      <td>711</td>
      <td>100</td>
      <td>8.874</td>
      <td>1</td>
      <td>1950333</td>
    </tr>
    <tr>
      <th>256</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>227</td>
      <td>1-0227</td>
      <td>0</td>
      <td>27</td>
      <td>training</td>
      <td>717</td>
      <td>100</td>
      <td>8.875</td>
      <td>1</td>
      <td>1614895</td>
    </tr>
    <tr>
      <th>210</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>187</td>
      <td>1-0187</td>
      <td>0</td>
      <td>27</td>
      <td>training</td>
      <td>703</td>
      <td>100</td>
      <td>8.878</td>
      <td>1</td>
      <td>1318712</td>
    </tr>
    <tr>
      <th>143</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>126</td>
      <td>1-0126</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>734</td>
      <td>100</td>
      <td>8.881</td>
      <td>1</td>
      <td>872432</td>
    </tr>
    <tr>
      <th>206</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>183</td>
      <td>1-0183</td>
      <td>0</td>
      <td>23</td>
      <td>training</td>
      <td>723</td>
      <td>100</td>
      <td>8.923</td>
      <td>1</td>
      <td>1296659</td>
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
      <td>862</td>
      <td>100</td>
      <td>8.534</td>
      <td>1</td>
      <td>541893</td>
    </tr>
    <tr>
      <th>43</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>827</td>
      <td>100</td>
      <td>8.541</td>
      <td>1</td>
      <td>262154</td>
    </tr>
    <tr>
      <th>181</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>814</td>
      <td>100</td>
      <td>8.606</td>
      <td>1</td>
      <td>1123185</td>
    </tr>
    <tr>
      <th>274</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>831</td>
      <td>100</td>
      <td>8.666</td>
      <td>1</td>
      <td>1749734</td>
    </tr>
    <tr>
      <th>321</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>775</td>
      <td>100</td>
      <td>8.742</td>
      <td>1</td>
      <td>2102238</td>
    </tr>
    <tr>
      <th>319</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>785</td>
      <td>100</td>
      <td>8.839</td>
      <td>1</td>
      <td>2084410</td>
    </tr>
    <tr>
      <th>275</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>711</td>
      <td>100</td>
      <td>8.864</td>
      <td>1</td>
      <td>1758473</td>
    </tr>
    <tr>
      <th>87</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>712</td>
      <td>100</td>
      <td>8.869</td>
      <td>1</td>
      <td>522951</td>
    </tr>
    <tr>
      <th>320</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>720</td>
      <td>100</td>
      <td>8.876</td>
      <td>1</td>
      <td>2093307</td>
    </tr>
    <tr>
      <th>91</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>675</td>
      <td>100</td>
      <td>8.934</td>
      <td>1</td>
      <td>550495</td>
    </tr>
    <tr>
      <th>182</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>707</td>
      <td>100</td>
      <td>8.937</td>
      <td>1</td>
      <td>1131856</td>
    </tr>
    <tr>
      <th>133</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>814</td>
      <td>100</td>
      <td>8.939</td>
      <td>1</td>
      <td>811232</td>
    </tr>
    <tr>
      <th>273</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>740</td>
      <td>100</td>
      <td>8.941</td>
      <td>1</td>
      <td>1740720</td>
    </tr>
    <tr>
      <th>226</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>703</td>
      <td>100</td>
      <td>8.953</td>
      <td>1</td>
      <td>1439855</td>
    </tr>
    <tr>
      <th>272</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>738</td>
      <td>100</td>
      <td>9.014</td>
      <td>1</td>
      <td>1731655</td>
    </tr>
    <tr>
      <th>224</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>665</td>
      <td>100</td>
      <td>9.055</td>
      <td>1</td>
      <td>1425994</td>
    </tr>
    <tr>
      <th>179</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>700</td>
      <td>100</td>
      <td>9.127</td>
      <td>1</td>
      <td>1109336</td>
    </tr>
    <tr>
      <th>270</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>629</td>
      <td>100</td>
      <td>9.131</td>
      <td>1</td>
      <td>1718243</td>
    </tr>
    <tr>
      <th>40</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>678</td>
      <td>100</td>
      <td>9.204</td>
      <td>1</td>
      <td>242160</td>
    </tr>
    <tr>
      <th>318</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>664</td>
      <td>100</td>
      <td>9.276</td>
      <td>1</td>
      <td>2075092</td>
    </tr>
    <tr>
      <th>134</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>527</td>
      <td>100</td>
      <td>9.457</td>
      <td>1</td>
      <td>820230</td>
    </tr>
    <tr>
      <th>178</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>573</td>
      <td>100</td>
      <td>9.485</td>
      <td>1</td>
      <td>1099778</td>
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
    

