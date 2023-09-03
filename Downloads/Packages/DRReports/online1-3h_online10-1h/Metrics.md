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
PREFIX='rl-deepracer-online1-3h_online10-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 15, Training episodes: 282, Evaluation episodes: 84


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

    Successfully loaded training round 1 for worker 0: Iterations: 15, Training episodes: 282, Evaluation episodes: 84


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
      <th>01-010</th>
      <th>10</th>
      <td>162.70</td>
      <td>39.70</td>
      <td>3.97145</td>
      <td>0.10</td>
      <td>20</td>
      <td>292.500000</td>
      <td>66.166667</td>
      <td>6.397500</td>
      <td>0.333333</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-011</th>
      <th>11</th>
      <td>249.25</td>
      <td>61.25</td>
      <td>5.77675</td>
      <td>0.15</td>
      <td>20</td>
      <td>480.500000</td>
      <td>89.333333</td>
      <td>8.252500</td>
      <td>0.666667</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-012</th>
      <th>12</th>
      <td>228.30</td>
      <td>47.20</td>
      <td>4.52085</td>
      <td>0.20</td>
      <td>20</td>
      <td>487.000000</td>
      <td>81.666667</td>
      <td>7.583667</td>
      <td>0.666667</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-013</th>
      <th>13</th>
      <td>301.70</td>
      <td>64.20</td>
      <td>6.03555</td>
      <td>0.25</td>
      <td>20</td>
      <td>551.666667</td>
      <td>91.166667</td>
      <td>8.296667</td>
      <td>0.833333</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>01-014</th>
      <th>14</th>
      <td>379.00</td>
      <td>65.00</td>
      <td>6.07100</td>
      <td>0.50</td>
      <td>2</td>
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

    Latest iteration: 01-014 / master 14
    Episodes: 282


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
      <th>247</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>194</td>
      <td>1-0194</td>
      <td>0</td>
      <td>14</td>
      <td>training</td>
      <td>941</td>
      <td>100</td>
      <td>8.211</td>
      <td>1</td>
      <td>1557471</td>
    </tr>
    <tr>
      <th>343</th>
      <td>01-013</td>
      <td>1</td>
      <td>13</td>
      <td>13</td>
      <td>266</td>
      <td>1-0266</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>897</td>
      <td>100</td>
      <td>8.273</td>
      <td>1</td>
      <td>2117908</td>
    </tr>
    <tr>
      <th>246</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>193</td>
      <td>1-0193</td>
      <td>0</td>
      <td>13</td>
      <td>training</td>
      <td>883</td>
      <td>100</td>
      <td>8.336</td>
      <td>1</td>
      <td>1549082</td>
    </tr>
    <tr>
      <th>326</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>255</td>
      <td>1-0255</td>
      <td>0</td>
      <td>15</td>
      <td>training</td>
      <td>806</td>
      <td>100</td>
      <td>8.403</td>
      <td>1</td>
      <td>2007195</td>
    </tr>
    <tr>
      <th>318</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>247</td>
      <td>1-0247</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>825</td>
      <td>100</td>
      <td>8.470</td>
      <td>1</td>
      <td>1973196</td>
    </tr>
    <tr>
      <th>110</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>87</td>
      <td>1-0087</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>854</td>
      <td>100</td>
      <td>8.479</td>
      <td>1</td>
      <td>680293</td>
    </tr>
    <tr>
      <th>106</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>83</td>
      <td>1-0083</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>840</td>
      <td>100</td>
      <td>8.530</td>
      <td>1</td>
      <td>650234</td>
    </tr>
    <tr>
      <th>116</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>93</td>
      <td>1-0093</td>
      <td>0</td>
      <td>13</td>
      <td>training</td>
      <td>833</td>
      <td>100</td>
      <td>8.535</td>
      <td>1</td>
      <td>721034</td>
    </tr>
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
      <td>782</td>
      <td>100</td>
      <td>8.536</td>
      <td>1</td>
      <td>347591</td>
    </tr>
    <tr>
      <th>213</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>166</td>
      <td>1-0166</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>847</td>
      <td>100</td>
      <td>8.540</td>
      <td>1</td>
      <td>1355992</td>
    </tr>
    <tr>
      <th>187</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>146</td>
      <td>1-0146</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>800</td>
      <td>100</td>
      <td>8.601</td>
      <td>1</td>
      <td>1210900</td>
    </tr>
    <tr>
      <th>161</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>126</td>
      <td>1-0126</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>843</td>
      <td>100</td>
      <td>8.609</td>
      <td>1</td>
      <td>1015881</td>
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
      <td>786</td>
      <td>100</td>
      <td>8.615</td>
      <td>1</td>
      <td>198589</td>
    </tr>
    <tr>
      <th>340</th>
      <td>01-013</td>
      <td>1</td>
      <td>13</td>
      <td>13</td>
      <td>263</td>
      <td>1-0263</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>775</td>
      <td>100</td>
      <td>8.657</td>
      <td>1</td>
      <td>2098047</td>
    </tr>
    <tr>
      <th>299</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>234</td>
      <td>1-0234</td>
      <td>0</td>
      <td>14</td>
      <td>training</td>
      <td>766</td>
      <td>100</td>
      <td>8.663</td>
      <td>1</td>
      <td>1858438</td>
    </tr>
    <tr>
      <th>197</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>156</td>
      <td>1-0156</td>
      <td>0</td>
      <td>16</td>
      <td>training</td>
      <td>733</td>
      <td>100</td>
      <td>8.666</td>
      <td>1</td>
      <td>1270833</td>
    </tr>
    <tr>
      <th>212</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>165</td>
      <td>1-0165</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>790</td>
      <td>100</td>
      <td>8.667</td>
      <td>1</td>
      <td>1347269</td>
    </tr>
    <tr>
      <th>238</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>185</td>
      <td>1-0185</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>783</td>
      <td>100</td>
      <td>8.669</td>
      <td>1</td>
      <td>1497276</td>
    </tr>
    <tr>
      <th>145</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>116</td>
      <td>1-0116</td>
      <td>0</td>
      <td>16</td>
      <td>training</td>
      <td>752</td>
      <td>100</td>
      <td>8.675</td>
      <td>1</td>
      <td>910116</td>
    </tr>
    <tr>
      <th>109</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>86</td>
      <td>1-0086</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>732</td>
      <td>100</td>
      <td>8.731</td>
      <td>1</td>
      <td>671495</td>
    </tr>
    <tr>
      <th>243</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>190</td>
      <td>1-0190</td>
      <td>0</td>
      <td>10</td>
      <td>training</td>
      <td>725</td>
      <td>100</td>
      <td>8.792</td>
      <td>1</td>
      <td>1525013</td>
    </tr>
    <tr>
      <th>365</th>
      <td>01-014</td>
      <td>1</td>
      <td>14</td>
      <td>14</td>
      <td>282</td>
      <td>1-0282</td>
      <td>0</td>
      <td>2</td>
      <td>training</td>
      <td>666</td>
      <td>100</td>
      <td>8.794</td>
      <td>1</td>
      <td>2260938</td>
    </tr>
    <tr>
      <th>324</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>253</td>
      <td>1-0253</td>
      <td>0</td>
      <td>13</td>
      <td>training</td>
      <td>684</td>
      <td>100</td>
      <td>8.800</td>
      <td>1</td>
      <td>1991798</td>
    </tr>
    <tr>
      <th>290</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>225</td>
      <td>1-0225</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>757</td>
      <td>100</td>
      <td>8.802</td>
      <td>1</td>
      <td>1802907</td>
    </tr>
    <tr>
      <th>272</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>213</td>
      <td>1-0213</td>
      <td>0</td>
      <td>13</td>
      <td>training</td>
      <td>715</td>
      <td>100</td>
      <td>8.813</td>
      <td>1</td>
      <td>1707699</td>
    </tr>
    <tr>
      <th>117</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>94</td>
      <td>1-0094</td>
      <td>0</td>
      <td>14</td>
      <td>training</td>
      <td>730</td>
      <td>100</td>
      <td>8.817</td>
      <td>1</td>
      <td>729623</td>
    </tr>
    <tr>
      <th>251</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>198</td>
      <td>1-0198</td>
      <td>0</td>
      <td>18</td>
      <td>training</td>
      <td>649</td>
      <td>100</td>
      <td>8.860</td>
      <td>1</td>
      <td>1588546</td>
    </tr>
    <tr>
      <th>185</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>144</td>
      <td>1-0144</td>
      <td>0</td>
      <td>4</td>
      <td>training</td>
      <td>684</td>
      <td>100</td>
      <td>8.862</td>
      <td>1</td>
      <td>1200032</td>
    </tr>
    <tr>
      <th>252</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>199</td>
      <td>1-0199</td>
      <td>0</td>
      <td>19</td>
      <td>training</td>
      <td>681</td>
      <td>100</td>
      <td>8.864</td>
      <td>1</td>
      <td>1597486</td>
    </tr>
    <tr>
      <th>91</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>74</td>
      <td>1-0074</td>
      <td>0</td>
      <td>14</td>
      <td>training</td>
      <td>668</td>
      <td>100</td>
      <td>8.873</td>
      <td>1</td>
      <td>546741</td>
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
      <td>923</td>
      <td>100</td>
      <td>8.315</td>
      <td>1</td>
      <td>441496</td>
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
      <td>837</td>
      <td>100</td>
      <td>8.533</td>
      <td>1</td>
      <td>795197</td>
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
      <td>833</td>
      <td>100</td>
      <td>8.591</td>
      <td>1</td>
      <td>159138</td>
    </tr>
    <tr>
      <th>229</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>180</td>
      <td>1-0180</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>819</td>
      <td>100</td>
      <td>8.598</td>
      <td>1</td>
      <td>1446892</td>
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
      <td>796</td>
      <td>100</td>
      <td>8.676</td>
      <td>1</td>
      <td>454339</td>
    </tr>
    <tr>
      <th>150</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>785</td>
      <td>100</td>
      <td>8.731</td>
      <td>1</td>
      <td>943275</td>
    </tr>
    <tr>
      <th>152</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>757</td>
      <td>100</td>
      <td>8.762</td>
      <td>1</td>
      <td>961528</td>
    </tr>
    <tr>
      <th>155</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>753</td>
      <td>100</td>
      <td>8.801</td>
      <td>1</td>
      <td>988613</td>
    </tr>
    <tr>
      <th>128</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>100</td>
      <td>1-0100</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>769</td>
      <td>100</td>
      <td>8.803</td>
      <td>1</td>
      <td>803781</td>
    </tr>
    <tr>
      <th>361</th>
      <td>01-013</td>
      <td>1</td>
      <td>13</td>
      <td>13</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>728</td>
      <td>100</td>
      <td>8.804</td>
      <td>1</td>
      <td>2229800</td>
    </tr>
    <tr>
      <th>101</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>744</td>
      <td>100</td>
      <td>8.809</td>
      <td>1</td>
      <td>609295</td>
    </tr>
    <tr>
      <th>359</th>
      <td>01-013</td>
      <td>1</td>
      <td>13</td>
      <td>13</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>698</td>
      <td>100</td>
      <td>8.811</td>
      <td>1</td>
      <td>2211978</td>
    </tr>
    <tr>
      <th>49</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>757</td>
      <td>100</td>
      <td>8.818</td>
      <td>1</td>
      <td>302655</td>
    </tr>
    <tr>
      <th>99</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>720</td>
      <td>100</td>
      <td>8.846</td>
      <td>1</td>
      <td>595558</td>
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
      <td>705</td>
      <td>100</td>
      <td>8.870</td>
      <td>1</td>
      <td>167798</td>
    </tr>
    <tr>
      <th>360</th>
      <td>01-013</td>
      <td>1</td>
      <td>13</td>
      <td>13</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>680</td>
      <td>100</td>
      <td>8.887</td>
      <td>1</td>
      <td>2220838</td>
    </tr>
    <tr>
      <th>202</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>697</td>
      <td>100</td>
      <td>8.909</td>
      <td>1</td>
      <td>1295688</td>
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
      <td>665</td>
      <td>100</td>
      <td>8.923</td>
      <td>1</td>
      <td>1167168</td>
    </tr>
    <tr>
      <th>257</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>674</td>
      <td>100</td>
      <td>8.928</td>
      <td>1</td>
      <td>1638307</td>
    </tr>
    <tr>
      <th>180</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>677</td>
      <td>100</td>
      <td>8.929</td>
      <td>1</td>
      <td>1158160</td>
    </tr>
    <tr>
      <th>337</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>260</td>
      <td>1-0260</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>658</td>
      <td>100</td>
      <td>8.932</td>
      <td>1</td>
      <td>2076302</td>
    </tr>
    <tr>
      <th>336</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>260</td>
      <td>1-0260</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>703</td>
      <td>100</td>
      <td>8.934</td>
      <td>1</td>
      <td>2067308</td>
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
      <td>710</td>
      <td>100</td>
      <td>8.941</td>
      <td>1</td>
      <td>623023</td>
    </tr>
    <tr>
      <th>307</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>715</td>
      <td>100</td>
      <td>8.962</td>
      <td>1</td>
      <td>1907048</td>
    </tr>
    <tr>
      <th>98</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>677</td>
      <td>100</td>
      <td>8.979</td>
      <td>1</td>
      <td>586533</td>
    </tr>
    <tr>
      <th>153</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>662</td>
      <td>100</td>
      <td>8.987</td>
      <td>1</td>
      <td>970358</td>
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
      <td>662</td>
      <td>100</td>
      <td>8.993</td>
      <td>1</td>
      <td>293609</td>
    </tr>
    <tr>
      <th>282</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>220</td>
      <td>1-0220</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>634</td>
      <td>100</td>
      <td>8.998</td>
      <td>1</td>
      <td>1752842</td>
    </tr>
    <tr>
      <th>176</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>642</td>
      <td>100</td>
      <td>9.011</td>
      <td>1</td>
      <td>1121339</td>
    </tr>
    <tr>
      <th>125</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>100</td>
      <td>1-0100</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>664</td>
      <td>100</td>
      <td>9.039</td>
      <td>1</td>
      <td>781353</td>
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
    

