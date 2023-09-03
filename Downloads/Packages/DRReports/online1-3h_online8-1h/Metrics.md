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
PREFIX='rl-deepracer-online1-3h_online8-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 8, Training episodes: 307, Evaluation episodes: 42


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

    Successfully loaded training round 1 for worker 0: Iterations: 8, Training episodes: 307, Evaluation episodes: 42


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
      <td>381.150000</td>
      <td>72.32500</td>
      <td>6.667350</td>
      <td>0.375000</td>
      <td>40</td>
      <td>326.000000</td>
      <td>65.333333</td>
      <td>6.070333</td>
      <td>0.333333</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-004</th>
      <th>4</th>
      <td>338.975000</td>
      <td>65.10000</td>
      <td>6.027225</td>
      <td>0.300000</td>
      <td>40</td>
      <td>555.166667</td>
      <td>91.000000</td>
      <td>8.298333</td>
      <td>0.833333</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-005</th>
      <th>5</th>
      <td>363.900000</td>
      <td>70.60000</td>
      <td>6.594000</td>
      <td>0.400000</td>
      <td>40</td>
      <td>679.166667</td>
      <td>100.000000</td>
      <td>9.043667</td>
      <td>1.000000</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-006</th>
      <th>6</th>
      <td>314.225000</td>
      <td>66.35000</td>
      <td>6.229375</td>
      <td>0.275000</td>
      <td>40</td>
      <td>505.166667</td>
      <td>75.000000</td>
      <td>6.729000</td>
      <td>0.500000</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-007</th>
      <th>7</th>
      <td>285.259259</td>
      <td>63.62963</td>
      <td>6.029778</td>
      <td>0.185185</td>
      <td>27</td>
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
    Episodes: 307


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
      <th>162</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>145</td>
      <td>1-0145</td>
      <td>0</td>
      <td>25</td>
      <td>training</td>
      <td>937</td>
      <td>100</td>
      <td>8.210</td>
      <td>1</td>
      <td>1000181</td>
    </tr>
    <tr>
      <th>255</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>226</td>
      <td>1-0226</td>
      <td>0</td>
      <td>26</td>
      <td>training</td>
      <td>917</td>
      <td>100</td>
      <td>8.267</td>
      <td>1</td>
      <td>1602793</td>
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
      <td>847</td>
      <td>100</td>
      <td>8.274</td>
      <td>1</td>
      <td>1012845</td>
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
      <td>923</td>
      <td>100</td>
      <td>8.279</td>
      <td>1</td>
      <td>1290779</td>
    </tr>
    <tr>
      <th>187</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>164</td>
      <td>1-0164</td>
      <td>0</td>
      <td>4</td>
      <td>training</td>
      <td>862</td>
      <td>100</td>
      <td>8.396</td>
      <td>1</td>
      <td>1162718</td>
    </tr>
    <tr>
      <th>141</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>124</td>
      <td>1-0124</td>
      <td>0</td>
      <td>4</td>
      <td>training</td>
      <td>826</td>
      <td>100</td>
      <td>8.469</td>
      <td>1</td>
      <td>856915</td>
    </tr>
    <tr>
      <th>254</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>225</td>
      <td>1-0225</td>
      <td>0</td>
      <td>25</td>
      <td>training</td>
      <td>859</td>
      <td>100</td>
      <td>8.525</td>
      <td>1</td>
      <td>1594198</td>
    </tr>
    <tr>
      <th>161</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>144</td>
      <td>1-0144</td>
      <td>0</td>
      <td>24</td>
      <td>training</td>
      <td>841</td>
      <td>100</td>
      <td>8.536</td>
      <td>1</td>
      <td>991579</td>
    </tr>
    <tr>
      <th>327</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>286</td>
      <td>1-0286</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>853</td>
      <td>100</td>
      <td>8.536</td>
      <td>1</td>
      <td>2087083</td>
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
      <td>800</td>
      <td>100</td>
      <td>8.543</td>
      <td>1</td>
      <td>492517</td>
    </tr>
    <tr>
      <th>189</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>166</td>
      <td>1-0166</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>805</td>
      <td>100</td>
      <td>8.606</td>
      <td>1</td>
      <td>1180655</td>
    </tr>
    <tr>
      <th>72</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>67</td>
      <td>1-0067</td>
      <td>0</td>
      <td>27</td>
      <td>training</td>
      <td>838</td>
      <td>100</td>
      <td>8.609</td>
      <td>1</td>
      <td>436184</td>
    </tr>
    <tr>
      <th>117</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>106</td>
      <td>1-0106</td>
      <td>0</td>
      <td>26</td>
      <td>training</td>
      <td>824</td>
      <td>100</td>
      <td>8.610</td>
      <td>1</td>
      <td>707716</td>
    </tr>
    <tr>
      <th>157</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>training</td>
      <td>804</td>
      <td>100</td>
      <td>8.610</td>
      <td>1</td>
      <td>971777</td>
    </tr>
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
      <td>811</td>
      <td>100</td>
      <td>8.666</td>
      <td>1</td>
      <td>1474057</td>
    </tr>
    <tr>
      <th>93</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>82</td>
      <td>1-0082</td>
      <td>0</td>
      <td>2</td>
      <td>training</td>
      <td>710</td>
      <td>100</td>
      <td>8.670</td>
      <td>1</td>
      <td>578130</td>
    </tr>
    <tr>
      <th>301</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>266</td>
      <td>1-0266</td>
      <td>0</td>
      <td>26</td>
      <td>training</td>
      <td>801</td>
      <td>100</td>
      <td>8.671</td>
      <td>1</td>
      <td>1909943</td>
    </tr>
    <tr>
      <th>333</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>292</td>
      <td>1-0292</td>
      <td>0</td>
      <td>12</td>
      <td>training</td>
      <td>761</td>
      <td>100</td>
      <td>8.672</td>
      <td>1</td>
      <td>2133943</td>
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
      <td>770</td>
      <td>100</td>
      <td>8.729</td>
      <td>1</td>
      <td>1787151</td>
    </tr>
    <tr>
      <th>276</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>241</td>
      <td>1-0241</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>708</td>
      <td>100</td>
      <td>8.735</td>
      <td>1</td>
      <td>1765537</td>
    </tr>
    <tr>
      <th>215</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>192</td>
      <td>1-0192</td>
      <td>0</td>
      <td>32</td>
      <td>training</td>
      <td>758</td>
      <td>100</td>
      <td>8.736</td>
      <td>1</td>
      <td>1329987</td>
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
      <td>794</td>
      <td>100</td>
      <td>8.744</td>
      <td>1</td>
      <td>148214</td>
    </tr>
    <tr>
      <th>147</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>130</td>
      <td>1-0130</td>
      <td>0</td>
      <td>10</td>
      <td>training</td>
      <td>755</td>
      <td>100</td>
      <td>8.746</td>
      <td>1</td>
      <td>898911</td>
    </tr>
    <tr>
      <th>241</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>212</td>
      <td>1-0212</td>
      <td>0</td>
      <td>12</td>
      <td>training</td>
      <td>720</td>
      <td>100</td>
      <td>8.806</td>
      <td>1</td>
      <td>1525127</td>
    </tr>
    <tr>
      <th>46</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>41</td>
      <td>1-0041</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>688</td>
      <td>100</td>
      <td>8.807</td>
      <td>1</td>
      <td>269984</td>
    </tr>
    <tr>
      <th>12</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>13</td>
      <td>1-0013</td>
      <td>0</td>
      <td>13</td>
      <td>training</td>
      <td>737</td>
      <td>100</td>
      <td>8.808</td>
      <td>1</td>
      <td>79152</td>
    </tr>
    <tr>
      <th>119</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>108</td>
      <td>1-0108</td>
      <td>0</td>
      <td>28</td>
      <td>training</td>
      <td>739</td>
      <td>100</td>
      <td>8.809</td>
      <td>1</td>
      <td>725793</td>
    </tr>
    <tr>
      <th>199</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>176</td>
      <td>1-0176</td>
      <td>0</td>
      <td>16</td>
      <td>training</td>
      <td>674</td>
      <td>100</td>
      <td>8.809</td>
      <td>1</td>
      <td>1237983</td>
    </tr>
    <tr>
      <th>66</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>61</td>
      <td>1-0061</td>
      <td>0</td>
      <td>21</td>
      <td>training</td>
      <td>743</td>
      <td>100</td>
      <td>8.810</td>
      <td>1</td>
      <td>406108</td>
    </tr>
    <tr>
      <th>236</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>207</td>
      <td>1-0207</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>737</td>
      <td>100</td>
      <td>8.818</td>
      <td>1</td>
      <td>1482774</td>
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
      <td>904</td>
      <td>100</td>
      <td>8.406</td>
      <td>1</td>
      <td>2049539</td>
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
      <td>883</td>
      <td>100</td>
      <td>8.528</td>
      <td>1</td>
      <td>555735</td>
    </tr>
    <tr>
      <th>317</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>857</td>
      <td>100</td>
      <td>8.574</td>
      <td>1</td>
      <td>2026081</td>
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
      <td>795</td>
      <td>100</td>
      <td>8.706</td>
      <td>1</td>
      <td>816234</td>
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
      <td>765</td>
      <td>100</td>
      <td>8.763</td>
      <td>1</td>
      <td>1128386</td>
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
      <td>738</td>
      <td>100</td>
      <td>8.775</td>
      <td>1</td>
      <td>1394264</td>
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
      <td>762</td>
      <td>100</td>
      <td>8.801</td>
      <td>1</td>
      <td>1747741</td>
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
      <td>741</td>
      <td>100</td>
      <td>8.804</td>
      <td>1</td>
      <td>1710868</td>
    </tr>
    <tr>
      <th>316</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>763</td>
      <td>100</td>
      <td>8.823</td>
      <td>1</td>
      <td>2017218</td>
    </tr>
    <tr>
      <th>45</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>741</td>
      <td>100</td>
      <td>8.825</td>
      <td>1</td>
      <td>261100</td>
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
      <td>736</td>
      <td>100</td>
      <td>8.866</td>
      <td>1</td>
      <td>1756611</td>
    </tr>
    <tr>
      <th>228</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>670</td>
      <td>100</td>
      <td>9.003</td>
      <td>1</td>
      <td>1431062</td>
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
      <td>658</td>
      <td>100</td>
      <td>9.018</td>
      <td>1</td>
      <td>543705</td>
    </tr>
    <tr>
      <th>271</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>628</td>
      <td>100</td>
      <td>9.117</td>
      <td>1</td>
      <td>1719758</td>
    </tr>
    <tr>
      <th>136</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>640</td>
      <td>100</td>
      <td>9.129</td>
      <td>1</td>
      <td>829858</td>
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
      <td>622</td>
      <td>100</td>
      <td>9.137</td>
      <td>1</td>
      <td>564321</td>
    </tr>
    <tr>
      <th>225</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>598</td>
      <td>100</td>
      <td>9.211</td>
      <td>1</td>
      <td>1403125</td>
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
      <td>605</td>
      <td>100</td>
      <td>9.251</td>
      <td>1</td>
      <td>1738425</td>
    </tr>
    <tr>
      <th>227</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>590</td>
      <td>100</td>
      <td>9.253</td>
      <td>1</td>
      <td>1421743</td>
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
      <td>583</td>
      <td>100</td>
      <td>9.264</td>
      <td>1</td>
      <td>1137198</td>
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
      <td>595</td>
      <td>100</td>
      <td>9.281</td>
      <td>1</td>
      <td>1412402</td>
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
      <td>550</td>
      <td>100</td>
      <td>9.283</td>
      <td>1</td>
      <td>251783</td>
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
      <td>603</td>
      <td>100</td>
      <td>9.423</td>
      <td>1</td>
      <td>1728942</td>
    </tr>
    <tr>
      <th>86</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>526</td>
      <td>100</td>
      <td>9.447</td>
      <td>1</td>
      <td>529657</td>
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
    

