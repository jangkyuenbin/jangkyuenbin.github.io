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
PREFIX='rl-deepracer-online1-3h_online3-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 8, Training episodes: 301, Evaluation episodes: 92


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

    Successfully loaded training round 1 for worker 0: Iterations: 8, Training episodes: 301, Evaluation episodes: 92


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
      <td>344.400000</td>
      <td>51.525000</td>
      <td>5.038725</td>
      <td>0.175000</td>
      <td>40</td>
      <td>662.272727</td>
      <td>72.818182</td>
      <td>6.723182</td>
      <td>0.545455</td>
      <td>11.0</td>
    </tr>
    <tr>
      <th>01-004</th>
      <th>4</th>
      <td>350.825000</td>
      <td>56.825000</td>
      <td>5.488225</td>
      <td>0.150000</td>
      <td>40</td>
      <td>733.538462</td>
      <td>81.000000</td>
      <td>7.440308</td>
      <td>0.615385</td>
      <td>13.0</td>
    </tr>
    <tr>
      <th>01-005</th>
      <th>5</th>
      <td>338.075000</td>
      <td>54.600000</td>
      <td>5.356575</td>
      <td>0.150000</td>
      <td>40</td>
      <td>576.153846</td>
      <td>68.000000</td>
      <td>6.423846</td>
      <td>0.461538</td>
      <td>13.0</td>
    </tr>
    <tr>
      <th>01-006</th>
      <th>6</th>
      <td>370.725000</td>
      <td>58.450000</td>
      <td>5.676325</td>
      <td>0.175000</td>
      <td>40</td>
      <td>653.166667</td>
      <td>75.000000</td>
      <td>6.990500</td>
      <td>0.583333</td>
      <td>12.0</td>
    </tr>
    <tr>
      <th>01-007</th>
      <th>7</th>
      <td>443.714286</td>
      <td>65.142857</td>
      <td>6.303571</td>
      <td>0.333333</td>
      <td>21</td>
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
    Episodes: 301


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
      <th>188</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>146</td>
      <td>1-0146</td>
      <td>0</td>
      <td>26</td>
      <td>training</td>
      <td>1419</td>
      <td>100</td>
      <td>8.201</td>
      <td>1</td>
      <td>1022722</td>
    </tr>
    <tr>
      <th>113</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>87</td>
      <td>1-0087</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>1367</td>
      <td>100</td>
      <td>8.340</td>
      <td>1</td>
      <td>610654</td>
    </tr>
    <tr>
      <th>272</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>206</td>
      <td>1-0206</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>1322</td>
      <td>100</td>
      <td>8.340</td>
      <td>1</td>
      <td>1523623</td>
    </tr>
    <tr>
      <th>111</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>85</td>
      <td>1-0085</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>1241</td>
      <td>100</td>
      <td>8.394</td>
      <td>1</td>
      <td>593320</td>
    </tr>
    <tr>
      <th>324</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>245</td>
      <td>1-0245</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>1201</td>
      <td>100</td>
      <td>8.603</td>
      <td>1</td>
      <td>1821623</td>
    </tr>
    <tr>
      <th>187</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>145</td>
      <td>1-0145</td>
      <td>0</td>
      <td>25</td>
      <td>training</td>
      <td>1134</td>
      <td>100</td>
      <td>8.670</td>
      <td>1</td>
      <td>1013984</td>
    </tr>
    <tr>
      <th>345</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>266</td>
      <td>1-0266</td>
      <td>0</td>
      <td>26</td>
      <td>training</td>
      <td>1202</td>
      <td>100</td>
      <td>8.673</td>
      <td>1</td>
      <td>1951828</td>
    </tr>
    <tr>
      <th>298</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>232</td>
      <td>1-0232</td>
      <td>0</td>
      <td>32</td>
      <td>training</td>
      <td>1048</td>
      <td>100</td>
      <td>8.674</td>
      <td>1</td>
      <td>1669887</td>
    </tr>
    <tr>
      <th>239</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>186</td>
      <td>1-0186</td>
      <td>0</td>
      <td>26</td>
      <td>training</td>
      <td>1104</td>
      <td>100</td>
      <td>8.740</td>
      <td>1</td>
      <td>1328736</td>
    </tr>
    <tr>
      <th>378</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>287</td>
      <td>1-0287</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>1142</td>
      <td>100</td>
      <td>8.743</td>
      <td>1</td>
      <td>2136768</td>
    </tr>
    <tr>
      <th>219</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>166</td>
      <td>1-0166</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>1090</td>
      <td>100</td>
      <td>8.796</td>
      <td>1</td>
      <td>1209009</td>
    </tr>
    <tr>
      <th>168</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>126</td>
      <td>1-0126</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>1074</td>
      <td>100</td>
      <td>8.802</td>
      <td>1</td>
      <td>924918</td>
    </tr>
    <tr>
      <th>112</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>86</td>
      <td>1-0086</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>1103</td>
      <td>100</td>
      <td>8.805</td>
      <td>1</td>
      <td>601788</td>
    </tr>
    <tr>
      <th>293</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>227</td>
      <td>1-0227</td>
      <td>0</td>
      <td>27</td>
      <td>training</td>
      <td>997</td>
      <td>100</td>
      <td>8.929</td>
      <td>1</td>
      <td>1635226</td>
    </tr>
    <tr>
      <th>72</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>59</td>
      <td>1-0059</td>
      <td>0</td>
      <td>19</td>
      <td>training</td>
      <td>1009</td>
      <td>100</td>
      <td>8.933</td>
      <td>1</td>
      <td>372048</td>
    </tr>
    <tr>
      <th>109</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>83</td>
      <td>1-0083</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>959</td>
      <td>100</td>
      <td>8.938</td>
      <td>1</td>
      <td>581906</td>
    </tr>
    <tr>
      <th>75</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>62</td>
      <td>1-0062</td>
      <td>0</td>
      <td>22</td>
      <td>training</td>
      <td>921</td>
      <td>100</td>
      <td>9.001</td>
      <td>1</td>
      <td>389177</td>
    </tr>
    <tr>
      <th>234</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>181</td>
      <td>1-0181</td>
      <td>0</td>
      <td>21</td>
      <td>training</td>
      <td>970</td>
      <td>100</td>
      <td>9.002</td>
      <td>1</td>
      <td>1299208</td>
    </tr>
    <tr>
      <th>131</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>105</td>
      <td>1-0105</td>
      <td>0</td>
      <td>25</td>
      <td>training</td>
      <td>960</td>
      <td>100</td>
      <td>9.003</td>
      <td>1</td>
      <td>704183</td>
    </tr>
    <tr>
      <th>167</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>125</td>
      <td>1-0125</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>994</td>
      <td>100</td>
      <td>9.003</td>
      <td>1</td>
      <td>915844</td>
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
      <td>992</td>
      <td>100</td>
      <td>9.006</td>
      <td>1</td>
      <td>141707</td>
    </tr>
    <tr>
      <th>24</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>25</td>
      <td>1-0025</td>
      <td>0</td>
      <td>25</td>
      <td>training</td>
      <td>970</td>
      <td>100</td>
      <td>9.072</td>
      <td>1</td>
      <td>132575</td>
    </tr>
    <tr>
      <th>221</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>168</td>
      <td>1-0168</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>922</td>
      <td>100</td>
      <td>9.084</td>
      <td>1</td>
      <td>1219552</td>
    </tr>
    <tr>
      <th>62</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>49</td>
      <td>1-0049</td>
      <td>0</td>
      <td>9</td>
      <td>training</td>
      <td>917</td>
      <td>100</td>
      <td>9.134</td>
      <td>1</td>
      <td>324052</td>
    </tr>
    <tr>
      <th>392</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>301</td>
      <td>1-0301</td>
      <td>0</td>
      <td>21</td>
      <td>training</td>
      <td>989</td>
      <td>100</td>
      <td>9.137</td>
      <td>1</td>
      <td>2241038</td>
    </tr>
    <tr>
      <th>137</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>111</td>
      <td>1-0111</td>
      <td>0</td>
      <td>31</td>
      <td>training</td>
      <td>904</td>
      <td>100</td>
      <td>9.138</td>
      <td>1</td>
      <td>746378</td>
    </tr>
    <tr>
      <th>146</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>40</td>
      <td>training</td>
      <td>889</td>
      <td>100</td>
      <td>9.139</td>
      <td>1</td>
      <td>800989</td>
    </tr>
    <tr>
      <th>384</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>293</td>
      <td>1-0293</td>
      <td>0</td>
      <td>13</td>
      <td>training</td>
      <td>874</td>
      <td>100</td>
      <td>9.142</td>
      <td>1</td>
      <td>2190899</td>
    </tr>
    <tr>
      <th>339</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>260</td>
      <td>1-0260</td>
      <td>0</td>
      <td>20</td>
      <td>training</td>
      <td>880</td>
      <td>100</td>
      <td>9.146</td>
      <td>1</td>
      <td>1908819</td>
    </tr>
    <tr>
      <th>285</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>219</td>
      <td>1-0219</td>
      <td>0</td>
      <td>19</td>
      <td>training</td>
      <td>889</td>
      <td>100</td>
      <td>9.147</td>
      <td>1</td>
      <td>1601954</td>
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
      <th>162</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1271</td>
      <td>100</td>
      <td>8.538</td>
      <td>1</td>
      <td>894648</td>
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
      <td>1239</td>
      <td>100</td>
      <td>8.620</td>
      <td>1</td>
      <td>245710</td>
    </tr>
    <tr>
      <th>360</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1223</td>
      <td>100</td>
      <td>8.622</td>
      <td>1</td>
      <td>2031973</td>
    </tr>
    <tr>
      <th>258</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1246</td>
      <td>100</td>
      <td>8.690</td>
      <td>1</td>
      <td>1436206</td>
    </tr>
    <tr>
      <th>257</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1126</td>
      <td>100</td>
      <td>8.811</td>
      <td>1</td>
      <td>1427336</td>
    </tr>
    <tr>
      <th>96</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1043</td>
      <td>100</td>
      <td>8.857</td>
      <td>1</td>
      <td>500912</td>
    </tr>
    <tr>
      <th>266</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1126</td>
      <td>100</td>
      <td>8.861</td>
      <td>1</td>
      <td>1492560</td>
    </tr>
    <tr>
      <th>307</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1118</td>
      <td>100</td>
      <td>8.870</td>
      <td>1</td>
      <td>1718237</td>
    </tr>
    <tr>
      <th>211</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1132</td>
      <td>100</td>
      <td>8.879</td>
      <td>1</td>
      <td>1159400</td>
    </tr>
    <tr>
      <th>157</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1120</td>
      <td>100</td>
      <td>8.884</td>
      <td>1</td>
      <td>869583</td>
    </tr>
    <tr>
      <th>42</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1007</td>
      <td>100</td>
      <td>8.938</td>
      <td>1</td>
      <td>228386</td>
    </tr>
    <tr>
      <th>205</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1105</td>
      <td>100</td>
      <td>8.943</td>
      <td>1</td>
      <td>1125584</td>
    </tr>
    <tr>
      <th>99</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1070</td>
      <td>100</td>
      <td>8.951</td>
      <td>1</td>
      <td>516710</td>
    </tr>
    <tr>
      <th>262</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1080</td>
      <td>100</td>
      <td>8.953</td>
      <td>1</td>
      <td>1464151</td>
    </tr>
    <tr>
      <th>317</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1099</td>
      <td>100</td>
      <td>8.954</td>
      <td>1</td>
      <td>1779675</td>
    </tr>
    <tr>
      <th>151</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>993</td>
      <td>100</td>
      <td>8.971</td>
      <td>1</td>
      <td>833268</td>
    </tr>
    <tr>
      <th>319</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>240</td>
      <td>1-0240</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1043</td>
      <td>100</td>
      <td>8.999</td>
      <td>1</td>
      <td>1793359</td>
    </tr>
    <tr>
      <th>256</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1048</td>
      <td>100</td>
      <td>9.007</td>
      <td>1</td>
      <td>1418307</td>
    </tr>
    <tr>
      <th>102</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1000</td>
      <td>100</td>
      <td>9.021</td>
      <td>1</td>
      <td>533501</td>
    </tr>
    <tr>
      <th>49</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1002</td>
      <td>100</td>
      <td>9.023</td>
      <td>1</td>
      <td>266836</td>
    </tr>
    <tr>
      <th>106</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1013</td>
      <td>100</td>
      <td>9.023</td>
      <td>1</td>
      <td>560108</td>
    </tr>
    <tr>
      <th>367</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>984</td>
      <td>100</td>
      <td>9.058</td>
      <td>1</td>
      <td>2075254</td>
    </tr>
    <tr>
      <th>204</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>949</td>
      <td>100</td>
      <td>9.065</td>
      <td>1</td>
      <td>1116465</td>
    </tr>
    <tr>
      <th>203</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>1057</td>
      <td>100</td>
      <td>9.068</td>
      <td>1</td>
      <td>1107325</td>
    </tr>
    <tr>
      <th>212</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>989</td>
      <td>100</td>
      <td>9.070</td>
      <td>1</td>
      <td>1168348</td>
    </tr>
    <tr>
      <th>364</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>961</td>
      <td>100</td>
      <td>9.080</td>
      <td>1</td>
      <td>2059202</td>
    </tr>
    <tr>
      <th>104</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>930</td>
      <td>100</td>
      <td>9.139</td>
      <td>1</td>
      <td>546446</td>
    </tr>
    <tr>
      <th>369</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>995</td>
      <td>100</td>
      <td>9.141</td>
      <td>1</td>
      <td>2093647</td>
    </tr>
    <tr>
      <th>265</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>983</td>
      <td>100</td>
      <td>9.147</td>
      <td>1</td>
      <td>1483360</td>
    </tr>
    <tr>
      <th>207</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>40</td>
      <td>evaluation</td>
      <td>962</td>
      <td>100</td>
      <td>9.154</td>
      <td>1</td>
      <td>1137055</td>
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
    

