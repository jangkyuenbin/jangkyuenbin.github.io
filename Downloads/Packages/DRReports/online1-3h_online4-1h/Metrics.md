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
PREFIX='rl-deepracer-online1-3h_online4-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 15, Training episodes: 294, Evaluation episodes: 119


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

    Successfully loaded training round 1 for worker 0: Iterations: 15, Training episodes: 294, Evaluation episodes: 119


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
      <td>187.050000</td>
      <td>47.100000</td>
      <td>4.732200</td>
      <td>0.100000</td>
      <td>20</td>
      <td>328.571429</td>
      <td>62.857143</td>
      <td>6.069429</td>
      <td>0.428571</td>
      <td>7.0</td>
    </tr>
    <tr>
      <th>01-011</th>
      <th>11</th>
      <td>141.250000</td>
      <td>38.750000</td>
      <td>3.926500</td>
      <td>0.000000</td>
      <td>20</td>
      <td>176.200000</td>
      <td>43.800000</td>
      <td>4.380900</td>
      <td>0.100000</td>
      <td>10.0</td>
    </tr>
    <tr>
      <th>01-012</th>
      <th>12</th>
      <td>234.050000</td>
      <td>57.300000</td>
      <td>5.570850</td>
      <td>0.100000</td>
      <td>20</td>
      <td>293.400000</td>
      <td>59.500000</td>
      <td>5.767500</td>
      <td>0.300000</td>
      <td>10.0</td>
    </tr>
    <tr>
      <th>01-013</th>
      <th>13</th>
      <td>191.050000</td>
      <td>49.500000</td>
      <td>4.769750</td>
      <td>0.050000</td>
      <td>20</td>
      <td>199.727273</td>
      <td>43.454545</td>
      <td>4.208091</td>
      <td>0.090909</td>
      <td>11.0</td>
    </tr>
    <tr>
      <th>01-014</th>
      <th>14</th>
      <td>195.928571</td>
      <td>51.357143</td>
      <td>5.076143</td>
      <td>0.071429</td>
      <td>14</td>
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
    Episodes: 294


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
      <th>45</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>38</td>
      <td>1-0038</td>
      <td>0</td>
      <td>18</td>
      <td>training</td>
      <td>882</td>
      <td>100</td>
      <td>8.202</td>
      <td>1</td>
      <td>287527</td>
    </tr>
    <tr>
      <th>124</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>94</td>
      <td>1-0094</td>
      <td>0</td>
      <td>14</td>
      <td>training</td>
      <td>922</td>
      <td>100</td>
      <td>8.330</td>
      <td>1</td>
      <td>727805</td>
    </tr>
    <tr>
      <th>344</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>247</td>
      <td>1-0247</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>810</td>
      <td>100</td>
      <td>8.465</td>
      <td>1</td>
      <td>1891641</td>
    </tr>
    <tr>
      <th>139</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>102</td>
      <td>1-0102</td>
      <td>0</td>
      <td>2</td>
      <td>training</td>
      <td>822</td>
      <td>100</td>
      <td>8.527</td>
      <td>1</td>
      <td>820666</td>
    </tr>
    <tr>
      <th>374</th>
      <td>01-013</td>
      <td>1</td>
      <td>13</td>
      <td>13</td>
      <td>267</td>
      <td>1-0267</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>790</td>
      <td>100</td>
      <td>8.538</td>
      <td>1</td>
      <td>2051503</td>
    </tr>
    <tr>
      <th>33</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>26</td>
      <td>1-0026</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>773</td>
      <td>100</td>
      <td>8.672</td>
      <td>1</td>
      <td>224843</td>
    </tr>
    <tr>
      <th>255</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>184</td>
      <td>1-0184</td>
      <td>0</td>
      <td>4</td>
      <td>training</td>
      <td>786</td>
      <td>100</td>
      <td>8.675</td>
      <td>1</td>
      <td>1479549</td>
    </tr>
    <tr>
      <th>237</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>174</td>
      <td>1-0174</td>
      <td>0</td>
      <td>14</td>
      <td>training</td>
      <td>750</td>
      <td>100</td>
      <td>8.677</td>
      <td>1</td>
      <td>1379206</td>
    </tr>
    <tr>
      <th>117</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>87</td>
      <td>1-0087</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>693</td>
      <td>100</td>
      <td>8.797</td>
      <td>1</td>
      <td>692934</td>
    </tr>
    <tr>
      <th>173</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>127</td>
      <td>1-0127</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>725</td>
      <td>100</td>
      <td>8.811</td>
      <td>1</td>
      <td>1004154</td>
    </tr>
    <tr>
      <th>257</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>186</td>
      <td>1-0186</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>721</td>
      <td>100</td>
      <td>8.812</td>
      <td>1</td>
      <td>1491953</td>
    </tr>
    <tr>
      <th>90</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>67</td>
      <td>1-0067</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>711</td>
      <td>100</td>
      <td>8.813</td>
      <td>1</td>
      <td>536099</td>
    </tr>
    <tr>
      <th>340</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>243</td>
      <td>1-0243</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>718</td>
      <td>100</td>
      <td>8.876</td>
      <td>1</td>
      <td>1872572</td>
    </tr>
    <tr>
      <th>286</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>206</td>
      <td>1-0206</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>685</td>
      <td>100</td>
      <td>8.946</td>
      <td>1</td>
      <td>1612821</td>
    </tr>
    <tr>
      <th>287</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>207</td>
      <td>1-0207</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>642</td>
      <td>100</td>
      <td>8.990</td>
      <td>1</td>
      <td>1621834</td>
    </tr>
    <tr>
      <th>116</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>86</td>
      <td>1-0086</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>698</td>
      <td>100</td>
      <td>8.993</td>
      <td>1</td>
      <td>683872</td>
    </tr>
    <tr>
      <th>175</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>129</td>
      <td>1-0129</td>
      <td>0</td>
      <td>9</td>
      <td>training</td>
      <td>668</td>
      <td>100</td>
      <td>8.996</td>
      <td>1</td>
      <td>1017223</td>
    </tr>
    <tr>
      <th>57</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>42</td>
      <td>1-0042</td>
      <td>0</td>
      <td>2</td>
      <td>training</td>
      <td>648</td>
      <td>100</td>
      <td>9.002</td>
      <td>1</td>
      <td>352937</td>
    </tr>
    <tr>
      <th>152</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>115</td>
      <td>1-0115</td>
      <td>0</td>
      <td>15</td>
      <td>training</td>
      <td>668</td>
      <td>100</td>
      <td>9.010</td>
      <td>1</td>
      <td>893125</td>
    </tr>
    <tr>
      <th>34</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>27</td>
      <td>1-0027</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>665</td>
      <td>100</td>
      <td>9.021</td>
      <td>1</td>
      <td>233566</td>
    </tr>
    <tr>
      <th>215</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>20</td>
      <td>training</td>
      <td>596</td>
      <td>100</td>
      <td>9.070</td>
      <td>1</td>
      <td>1245279</td>
    </tr>
    <tr>
      <th>144</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>107</td>
      <td>1-0107</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>612</td>
      <td>100</td>
      <td>9.133</td>
      <td>1</td>
      <td>842199</td>
    </tr>
    <tr>
      <th>406</th>
      <td>01-014</td>
      <td>1</td>
      <td>14</td>
      <td>14</td>
      <td>288</td>
      <td>1-0288</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>556</td>
      <td>100</td>
      <td>9.196</td>
      <td>1</td>
      <td>2205909</td>
    </tr>
    <tr>
      <th>203</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>148</td>
      <td>1-0148</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>600</td>
      <td>100</td>
      <td>9.198</td>
      <td>1</td>
      <td>1169878</td>
    </tr>
    <tr>
      <th>8</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>9</td>
      <td>1-0009</td>
      <td>0</td>
      <td>9</td>
      <td>training</td>
      <td>614</td>
      <td>100</td>
      <td>9.232</td>
      <td>1</td>
      <td>71789</td>
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
      <td>570</td>
      <td>100</td>
      <td>9.270</td>
      <td>1</td>
      <td>52923</td>
    </tr>
    <tr>
      <th>151</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>114</td>
      <td>1-0114</td>
      <td>0</td>
      <td>14</td>
      <td>training</td>
      <td>542</td>
      <td>100</td>
      <td>9.349</td>
      <td>1</td>
      <td>883725</td>
    </tr>
    <tr>
      <th>113</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>83</td>
      <td>1-0083</td>
      <td>0</td>
      <td>3</td>
      <td>training</td>
      <td>525</td>
      <td>100</td>
      <td>9.406</td>
      <td>1</td>
      <td>669470</td>
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
      <td>511</td>
      <td>100</td>
      <td>9.413</td>
      <td>1</td>
      <td>102850</td>
    </tr>
    <tr>
      <th>225</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>162</td>
      <td>1-0162</td>
      <td>0</td>
      <td>2</td>
      <td>training</td>
      <td>510</td>
      <td>100</td>
      <td>9.468</td>
      <td>1</td>
      <td>1309542</td>
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
      <th>27</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>809</td>
      <td>100</td>
      <td>8.606</td>
      <td>1</td>
      <td>193570</td>
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
      <td>789</td>
      <td>100</td>
      <td>8.615</td>
      <td>1</td>
      <td>621922</td>
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
      <td>817</td>
      <td>100</td>
      <td>8.668</td>
      <td>1</td>
      <td>153199</td>
    </tr>
    <tr>
      <th>109</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>831</td>
      <td>100</td>
      <td>8.680</td>
      <td>1</td>
      <td>648182</td>
    </tr>
    <tr>
      <th>54</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>781</td>
      <td>100</td>
      <td>8.711</td>
      <td>1</td>
      <td>333817</td>
    </tr>
    <tr>
      <th>20</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>805</td>
      <td>100</td>
      <td>8.729</td>
      <td>1</td>
      <td>144384</td>
    </tr>
    <tr>
      <th>83</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>60</td>
      <td>1-0060</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>757</td>
      <td>100</td>
      <td>8.744</td>
      <td>1</td>
      <td>506498</td>
    </tr>
    <tr>
      <th>80</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>60</td>
      <td>1-0060</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>768</td>
      <td>100</td>
      <td>8.751</td>
      <td>1</td>
      <td>483103</td>
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
      <td>693</td>
      <td>100</td>
      <td>8.769</td>
      <td>1</td>
      <td>180240</td>
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
      <td>771</td>
      <td>100</td>
      <td>8.780</td>
      <td>1</td>
      <td>766268</td>
    </tr>
    <tr>
      <th>216</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>728</td>
      <td>100</td>
      <td>8.786</td>
      <td>1</td>
      <td>1254485</td>
    </tr>
    <tr>
      <th>106</th>
      <td>01-003</td>
      <td>1</td>
      <td>3</td>
      <td>3</td>
      <td>80</td>
      <td>1-0080</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>784</td>
      <td>100</td>
      <td>8.799</td>
      <td>1</td>
      <td>630586</td>
    </tr>
    <tr>
      <th>165</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>780</td>
      <td>100</td>
      <td>8.813</td>
      <td>1</td>
      <td>968211</td>
    </tr>
    <tr>
      <th>250</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>180</td>
      <td>1-0180</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>755</td>
      <td>100</td>
      <td>8.814</td>
      <td>1</td>
      <td>1454081</td>
    </tr>
    <tr>
      <th>217</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>700</td>
      <td>100</td>
      <td>8.835</td>
      <td>1</td>
      <td>1263351</td>
    </tr>
    <tr>
      <th>223</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>802</td>
      <td>100</td>
      <td>8.853</td>
      <td>1</td>
      <td>1297294</td>
    </tr>
    <tr>
      <th>55</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>40</td>
      <td>1-0040</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>719</td>
      <td>100</td>
      <td>8.860</td>
      <td>1</td>
      <td>342614</td>
    </tr>
    <tr>
      <th>395</th>
      <td>01-013</td>
      <td>1</td>
      <td>13</td>
      <td>13</td>
      <td>280</td>
      <td>1-0280</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>731</td>
      <td>100</td>
      <td>8.860</td>
      <td>1</td>
      <td>2156992</td>
    </tr>
    <tr>
      <th>135</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>100</td>
      <td>1-0100</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>754</td>
      <td>100</td>
      <td>8.866</td>
      <td>1</td>
      <td>795295</td>
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
      <td>697</td>
      <td>100</td>
      <td>8.885</td>
      <td>1</td>
      <td>161949</td>
    </tr>
    <tr>
      <th>248</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>180</td>
      <td>1-0180</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>726</td>
      <td>100</td>
      <td>8.935</td>
      <td>1</td>
      <td>1435907</td>
    </tr>
    <tr>
      <th>166</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>668</td>
      <td>100</td>
      <td>9.004</td>
      <td>1</td>
      <td>977090</td>
    </tr>
    <tr>
      <th>195</th>
      <td>01-006</td>
      <td>1</td>
      <td>6</td>
      <td>6</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>694</td>
      <td>100</td>
      <td>9.006</td>
      <td>1</td>
      <td>1134335</td>
    </tr>
    <tr>
      <th>367</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>260</td>
      <td>1-0260</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>678</td>
      <td>100</td>
      <td>9.010</td>
      <td>1</td>
      <td>2025099</td>
    </tr>
    <tr>
      <th>361</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>260</td>
      <td>1-0260</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>676</td>
      <td>100</td>
      <td>9.018</td>
      <td>1</td>
      <td>1988843</td>
    </tr>
    <tr>
      <th>280</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>200</td>
      <td>1-0200</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>686</td>
      <td>100</td>
      <td>9.023</td>
      <td>1</td>
      <td>1590814</td>
    </tr>
    <tr>
      <th>164</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>657</td>
      <td>100</td>
      <td>9.031</td>
      <td>1</td>
      <td>959069</td>
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
      <td>609</td>
      <td>100</td>
      <td>9.098</td>
      <td>1</td>
      <td>468219</td>
    </tr>
    <tr>
      <th>219</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>160</td>
      <td>1-0160</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>648</td>
      <td>100</td>
      <td>9.151</td>
      <td>1</td>
      <td>1277677</td>
    </tr>
    <tr>
      <th>304</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>220</td>
      <td>1-0220</td>
      <td>0</td>
      <td>20</td>
      <td>evaluation</td>
      <td>646</td>
      <td>100</td>
      <td>9.155</td>
      <td>1</td>
      <td>1713363</td>
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
    

