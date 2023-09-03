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
PREFIX='rl-deepracer-online1-3h_online2-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 13, Training episodes: 260, Evaluation episodes: 93


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

    Successfully loaded training round 1 for worker 0: Iterations: 13, Training episodes: 260, Evaluation episodes: 93


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
      <th>01-008</th>
      <th>8</th>
      <td>384.5</td>
      <td>69.55</td>
      <td>6.63230</td>
      <td>0.15</td>
      <td>20</td>
      <td>616.625</td>
      <td>82.375000</td>
      <td>7.635250</td>
      <td>0.625000</td>
      <td>8</td>
    </tr>
    <tr>
      <th>01-009</th>
      <th>9</th>
      <td>499.2</td>
      <td>76.45</td>
      <td>7.18870</td>
      <td>0.45</td>
      <td>20</td>
      <td>483.000</td>
      <td>76.888889</td>
      <td>7.331667</td>
      <td>0.444444</td>
      <td>9</td>
    </tr>
    <tr>
      <th>01-010</th>
      <th>10</th>
      <td>364.3</td>
      <td>60.65</td>
      <td>5.86745</td>
      <td>0.25</td>
      <td>20</td>
      <td>383.400</td>
      <td>62.400000</td>
      <td>6.166900</td>
      <td>0.300000</td>
      <td>10</td>
    </tr>
    <tr>
      <th>01-011</th>
      <th>11</th>
      <td>379.2</td>
      <td>64.55</td>
      <td>6.13685</td>
      <td>0.25</td>
      <td>20</td>
      <td>623.750</td>
      <td>75.000000</td>
      <td>6.861000</td>
      <td>0.625000</td>
      <td>8</td>
    </tr>
    <tr>
      <th>01-012</th>
      <th>12</th>
      <td>463.8</td>
      <td>71.20</td>
      <td>6.68365</td>
      <td>0.35</td>
      <td>20</td>
      <td>585.000</td>
      <td>72.000000</td>
      <td>6.619500</td>
      <td>0.500000</td>
      <td>2</td>
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

    Latest iteration: 01-012 / master 12
    Episodes: 260


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
      <th>86</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>67</td>
      <td>1-0067</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>1044</td>
      <td>100</td>
      <td>8.286</td>
      <td>1</td>
      <td>522582</td>
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
      <td>963</td>
      <td>100</td>
      <td>8.405</td>
      <td>1</td>
      <td>204916</td>
    </tr>
    <tr>
      <th>60</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>47</td>
      <td>1-0047</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>1024</td>
      <td>100</td>
      <td>8.469</td>
      <td>1</td>
      <td>373154</td>
    </tr>
    <tr>
      <th>31</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>26</td>
      <td>1-0026</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>931</td>
      <td>100</td>
      <td>8.602</td>
      <td>1</td>
      <td>187372</td>
    </tr>
    <tr>
      <th>146</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>113</td>
      <td>1-0113</td>
      <td>0</td>
      <td>13</td>
      <td>training</td>
      <td>895</td>
      <td>100</td>
      <td>8.728</td>
      <td>1</td>
      <td>855423</td>
    </tr>
    <tr>
      <th>289</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>217</td>
      <td>1-0217</td>
      <td>0</td>
      <td>17</td>
      <td>training</td>
      <td>878</td>
      <td>100</td>
      <td>8.735</td>
      <td>1</td>
      <td>1850408</td>
    </tr>
    <tr>
      <th>334</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>244</td>
      <td>1-0244</td>
      <td>0</td>
      <td>4</td>
      <td>training</td>
      <td>899</td>
      <td>100</td>
      <td>8.735</td>
      <td>1</td>
      <td>2144616</td>
    </tr>
    <tr>
      <th>316</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>234</td>
      <td>1-0234</td>
      <td>0</td>
      <td>14</td>
      <td>training</td>
      <td>920</td>
      <td>100</td>
      <td>8.738</td>
      <td>1</td>
      <td>2022018</td>
    </tr>
    <tr>
      <th>59</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>46</td>
      <td>1-0046</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>910</td>
      <td>100</td>
      <td>8.740</td>
      <td>1</td>
      <td>364346</td>
    </tr>
    <tr>
      <th>336</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>246</td>
      <td>1-0246</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>851</td>
      <td>100</td>
      <td>8.800</td>
      <td>1</td>
      <td>2155880</td>
    </tr>
    <tr>
      <th>219</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>164</td>
      <td>1-0164</td>
      <td>0</td>
      <td>4</td>
      <td>training</td>
      <td>928</td>
      <td>100</td>
      <td>8.801</td>
      <td>1</td>
      <td>1367995</td>
    </tr>
    <tr>
      <th>244</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>181</td>
      <td>1-0181</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>872</td>
      <td>100</td>
      <td>8.806</td>
      <td>1</td>
      <td>1545462</td>
    </tr>
    <tr>
      <th>32</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>27</td>
      <td>1-0027</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>859</td>
      <td>100</td>
      <td>8.813</td>
      <td>1</td>
      <td>196036</td>
    </tr>
    <tr>
      <th>97</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>78</td>
      <td>1-0078</td>
      <td>0</td>
      <td>18</td>
      <td>training</td>
      <td>832</td>
      <td>100</td>
      <td>8.868</td>
      <td>1</td>
      <td>598595</td>
    </tr>
    <tr>
      <th>249</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>186</td>
      <td>1-0186</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>877</td>
      <td>100</td>
      <td>8.874</td>
      <td>1</td>
      <td>1574856</td>
    </tr>
    <tr>
      <th>167</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>128</td>
      <td>1-0128</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>838</td>
      <td>100</td>
      <td>8.875</td>
      <td>1</td>
      <td>986775</td>
    </tr>
    <tr>
      <th>28</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>23</td>
      <td>1-0023</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>866</td>
      <td>100</td>
      <td>8.881</td>
      <td>1</td>
      <td>166839</td>
    </tr>
    <tr>
      <th>281</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>209</td>
      <td>1-0209</td>
      <td>0</td>
      <td>9</td>
      <td>training</td>
      <td>842</td>
      <td>100</td>
      <td>8.925</td>
      <td>1</td>
      <td>1790481</td>
    </tr>
    <tr>
      <th>27</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>22</td>
      <td>1-0022</td>
      <td>0</td>
      <td>2</td>
      <td>training</td>
      <td>831</td>
      <td>100</td>
      <td>8.929</td>
      <td>1</td>
      <td>157841</td>
    </tr>
    <tr>
      <th>176</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>137</td>
      <td>1-0137</td>
      <td>0</td>
      <td>17</td>
      <td>training</td>
      <td>815</td>
      <td>100</td>
      <td>8.935</td>
      <td>1</td>
      <td>1050185</td>
    </tr>
    <tr>
      <th>332</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>242</td>
      <td>1-0242</td>
      <td>0</td>
      <td>2</td>
      <td>training</td>
      <td>816</td>
      <td>100</td>
      <td>8.940</td>
      <td>1</td>
      <td>2126483</td>
    </tr>
    <tr>
      <th>331</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>241</td>
      <td>1-0241</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>880</td>
      <td>100</td>
      <td>8.941</td>
      <td>1</td>
      <td>2117488</td>
    </tr>
    <tr>
      <th>190</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>143</td>
      <td>1-0143</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>858</td>
      <td>100</td>
      <td>8.996</td>
      <td>1</td>
      <td>1149332</td>
    </tr>
    <tr>
      <th>313</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>231</td>
      <td>1-0231</td>
      <td>0</td>
      <td>11</td>
      <td>training</td>
      <td>737</td>
      <td>100</td>
      <td>8.997</td>
      <td>1</td>
      <td>1994618</td>
    </tr>
    <tr>
      <th>80</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>61</td>
      <td>1-0061</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>797</td>
      <td>100</td>
      <td>9.003</td>
      <td>1</td>
      <td>499520</td>
    </tr>
    <tr>
      <th>262</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>199</td>
      <td>1-0199</td>
      <td>0</td>
      <td>19</td>
      <td>training</td>
      <td>824</td>
      <td>100</td>
      <td>9.007</td>
      <td>1</td>
      <td>1671789</td>
    </tr>
    <tr>
      <th>179</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>training</td>
      <td>751</td>
      <td>100</td>
      <td>9.067</td>
      <td>1</td>
      <td>1068584</td>
    </tr>
    <tr>
      <th>246</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>183</td>
      <td>1-0183</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>811</td>
      <td>100</td>
      <td>9.073</td>
      <td>1</td>
      <td>1559262</td>
    </tr>
    <tr>
      <th>349</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>259</td>
      <td>1-0259</td>
      <td>0</td>
      <td>19</td>
      <td>training</td>
      <td>784</td>
      <td>100</td>
      <td>9.073</td>
      <td>1</td>
      <td>2238084</td>
    </tr>
    <tr>
      <th>144</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>111</td>
      <td>1-0111</td>
      <td>0</td>
      <td>11</td>
      <td>training</td>
      <td>794</td>
      <td>100</td>
      <td>9.074</td>
      <td>1</td>
      <td>843359</td>
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
      <th>132</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>100</td>
      <td>1-0100</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>981</td>
      <td>100</td>
      <td>8.521</td>
      <td>1</td>
      <td>787099</td>
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
      <td>994</td>
      <td>100</td>
      <td>8.555</td>
      <td>1</td>
      <td>455284</td>
    </tr>
    <tr>
      <th>352</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>260</td>
      <td>1-0260</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>931</td>
      <td>100</td>
      <td>8.583</td>
      <td>1</td>
      <td>2257244</td>
    </tr>
    <tr>
      <th>79</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>60</td>
      <td>1-0060</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>964</td>
      <td>100</td>
      <td>8.652</td>
      <td>1</td>
      <td>490806</td>
    </tr>
    <tr>
      <th>239</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>180</td>
      <td>1-0180</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>915</td>
      <td>100</td>
      <td>8.703</td>
      <td>1</td>
      <td>1505023</td>
    </tr>
    <tr>
      <th>324</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>946</td>
      <td>100</td>
      <td>8.705</td>
      <td>1</td>
      <td>2071335</td>
    </tr>
    <tr>
      <th>187</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>976</td>
      <td>100</td>
      <td>8.736</td>
      <td>1</td>
      <td>1132061</td>
    </tr>
    <tr>
      <th>208</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>913</td>
      <td>100</td>
      <td>8.754</td>
      <td>1</td>
      <td>1282519</td>
    </tr>
    <tr>
      <th>76</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>60</td>
      <td>1-0060</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>928</td>
      <td>100</td>
      <td>8.791</td>
      <td>1</td>
      <td>463902</td>
    </tr>
    <tr>
      <th>22</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>848</td>
      <td>100</td>
      <td>8.816</td>
      <td>1</td>
      <td>122162</td>
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
      <td>823</td>
      <td>100</td>
      <td>8.866</td>
      <td>1</td>
      <td>145168</td>
    </tr>
    <tr>
      <th>329</th>
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
      <td>8.877</td>
      <td>1</td>
      <td>2104212</td>
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
      <td>910</td>
      <td>100</td>
      <td>8.879</td>
      <td>1</td>
      <td>472799</td>
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
      <td>948</td>
      <td>100</td>
      <td>8.893</td>
      <td>1</td>
      <td>615468</td>
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
      <td>918</td>
      <td>100</td>
      <td>8.910</td>
      <td>1</td>
      <td>113207</td>
    </tr>
    <tr>
      <th>326</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>871</td>
      <td>100</td>
      <td>8.927</td>
      <td>1</td>
      <td>2083896</td>
    </tr>
    <tr>
      <th>299</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>220</td>
      <td>1-0220</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>890</td>
      <td>100</td>
      <td>8.944</td>
      <td>1</td>
      <td>1903541</td>
    </tr>
    <tr>
      <th>53</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>900</td>
      <td>100</td>
      <td>8.945</td>
      <td>1</td>
      <td>331337</td>
    </tr>
    <tr>
      <th>156</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>921</td>
      <td>100</td>
      <td>8.959</td>
      <td>1</td>
      <td>916430</td>
    </tr>
    <tr>
      <th>212</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>906</td>
      <td>100</td>
      <td>8.973</td>
      <td>1</td>
      <td>1312995</td>
    </tr>
    <tr>
      <th>238</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>180</td>
      <td>1-0180</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>876</td>
      <td>100</td>
      <td>9.018</td>
      <td>1</td>
      <td>1495854</td>
    </tr>
    <tr>
      <th>78</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>60</td>
      <td>1-0060</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>830</td>
      <td>100</td>
      <td>9.022</td>
      <td>1</td>
      <td>481714</td>
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
      <td>832</td>
      <td>100</td>
      <td>9.057</td>
      <td>1</td>
      <td>312966</td>
    </tr>
    <tr>
      <th>327</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>937</td>
      <td>100</td>
      <td>9.058</td>
      <td>1</td>
      <td>2092882</td>
    </tr>
    <tr>
      <th>107</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>808</td>
      <td>100</td>
      <td>9.060</td>
      <td>1</td>
      <td>662331</td>
    </tr>
    <tr>
      <th>183</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>853</td>
      <td>100</td>
      <td>9.067</td>
      <td>1</td>
      <td>1102650</td>
    </tr>
    <tr>
      <th>184</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>852</td>
      <td>100</td>
      <td>9.069</td>
      <td>1</td>
      <td>1111771</td>
    </tr>
    <tr>
      <th>270</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>868</td>
      <td>100</td>
      <td>9.069</td>
      <td>1</td>
      <td>1732409</td>
    </tr>
    <tr>
      <th>240</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>180</td>
      <td>1-0180</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>872</td>
      <td>100</td>
      <td>9.075</td>
      <td>1</td>
      <td>1513778</td>
    </tr>
    <tr>
      <th>209</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>762</td>
      <td>100</td>
      <td>9.081</td>
      <td>1</td>
      <td>1291317</td>
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
    

