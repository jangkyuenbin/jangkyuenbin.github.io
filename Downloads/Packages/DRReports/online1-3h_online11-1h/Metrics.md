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
PREFIX='rl-deepracer-online1-3h_online11-1h'
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

    Successfully loaded training round 1 for worker 0: Iterations: 24, Training episodes: 240, Evaluation episodes: 139


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

    Successfully loaded training round 1 for worker 0: Iterations: 24, Training episodes: 240, Evaluation episodes: 139


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
      <th>01-019</th>
      <th>19</th>
      <td>154.7</td>
      <td>42.1</td>
      <td>4.3733</td>
      <td>0.0</td>
      <td>10</td>
      <td>253.166667</td>
      <td>68.333333</td>
      <td>6.833000</td>
      <td>0.333333</td>
      <td>6</td>
    </tr>
    <tr>
      <th>01-020</th>
      <th>20</th>
      <td>160.8</td>
      <td>42.6</td>
      <td>4.5568</td>
      <td>0.1</td>
      <td>10</td>
      <td>216.833333</td>
      <td>59.500000</td>
      <td>6.021667</td>
      <td>0.166667</td>
      <td>6</td>
    </tr>
    <tr>
      <th>01-021</th>
      <th>21</th>
      <td>134.1</td>
      <td>40.8</td>
      <td>4.2303</td>
      <td>0.0</td>
      <td>10</td>
      <td>130.166667</td>
      <td>49.000000</td>
      <td>5.039167</td>
      <td>0.166667</td>
      <td>6</td>
    </tr>
    <tr>
      <th>01-022</th>
      <th>22</th>
      <td>105.9</td>
      <td>30.0</td>
      <td>3.3822</td>
      <td>0.0</td>
      <td>10</td>
      <td>298.666667</td>
      <td>68.333333</td>
      <td>6.767333</td>
      <td>0.166667</td>
      <td>6</td>
    </tr>
    <tr>
      <th>01-023</th>
      <th>23</th>
      <td>117.5</td>
      <td>34.3</td>
      <td>3.6301</td>
      <td>0.0</td>
      <td>10</td>
      <td>55.000000</td>
      <td>21.000000</td>
      <td>1.928000</td>
      <td>0.000000</td>
      <td>1</td>
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

    Latest iteration: 01-023 / master 23
    Episodes: 240


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
      <th>38</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>27</td>
      <td>1-0027</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>832</td>
      <td>100</td>
      <td>8.470</td>
      <td>1</td>
      <td>247503</td>
    </tr>
    <tr>
      <th>134</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>87</td>
      <td>1-0087</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>810</td>
      <td>100</td>
      <td>8.529</td>
      <td>1</td>
      <td>826529</td>
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
      <td>814</td>
      <td>100</td>
      <td>8.658</td>
      <td>1</td>
      <td>61734</td>
    </tr>
    <tr>
      <th>153</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>100</td>
      <td>1-0100</td>
      <td>0</td>
      <td>10</td>
      <td>training</td>
      <td>662</td>
      <td>100</td>
      <td>8.807</td>
      <td>1</td>
      <td>966270</td>
    </tr>
    <tr>
      <th>149</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>96</td>
      <td>1-0096</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>620</td>
      <td>100</td>
      <td>8.934</td>
      <td>1</td>
      <td>944609</td>
    </tr>
    <tr>
      <th>166</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>107</td>
      <td>1-0107</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>623</td>
      <td>100</td>
      <td>8.996</td>
      <td>1</td>
      <td>1030555</td>
    </tr>
    <tr>
      <th>64</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>41</td>
      <td>1-0041</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>610</td>
      <td>100</td>
      <td>8.997</td>
      <td>1</td>
      <td>416569</td>
    </tr>
    <tr>
      <th>117</th>
      <td>01-007</td>
      <td>1</td>
      <td>7</td>
      <td>7</td>
      <td>76</td>
      <td>1-0076</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>614</td>
      <td>100</td>
      <td>9.003</td>
      <td>1</td>
      <td>728919</td>
    </tr>
    <tr>
      <th>293</th>
      <td>01-018</td>
      <td>1</td>
      <td>18</td>
      <td>18</td>
      <td>186</td>
      <td>1-0186</td>
      <td>0</td>
      <td>6</td>
      <td>training</td>
      <td>613</td>
      <td>100</td>
      <td>9.009</td>
      <td>1</td>
      <td>1762896</td>
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
      <td>644</td>
      <td>100</td>
      <td>9.069</td>
      <td>1</td>
      <td>43391</td>
    </tr>
    <tr>
      <th>7</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>8</td>
      <td>1-0008</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>581</td>
      <td>100</td>
      <td>9.146</td>
      <td>1</td>
      <td>52516</td>
    </tr>
    <tr>
      <th>230</th>
      <td>01-014</td>
      <td>1</td>
      <td>14</td>
      <td>14</td>
      <td>147</td>
      <td>1-0147</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>623</td>
      <td>100</td>
      <td>9.146</td>
      <td>1</td>
      <td>1412527</td>
    </tr>
    <tr>
      <th>132</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>85</td>
      <td>1-0085</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>607</td>
      <td>100</td>
      <td>9.267</td>
      <td>1</td>
      <td>815395</td>
    </tr>
    <tr>
      <th>193</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>122</td>
      <td>1-0122</td>
      <td>0</td>
      <td>2</td>
      <td>training</td>
      <td>528</td>
      <td>100</td>
      <td>9.269</td>
      <td>1</td>
      <td>1202334</td>
    </tr>
    <tr>
      <th>135</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>88</td>
      <td>1-0088</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>569</td>
      <td>100</td>
      <td>9.275</td>
      <td>1</td>
      <td>835127</td>
    </tr>
    <tr>
      <th>70</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>47</td>
      <td>1-0047</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>541</td>
      <td>100</td>
      <td>9.338</td>
      <td>1</td>
      <td>441363</td>
    </tr>
    <tr>
      <th>196</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>125</td>
      <td>1-0125</td>
      <td>0</td>
      <td>5</td>
      <td>training</td>
      <td>540</td>
      <td>100</td>
      <td>9.340</td>
      <td>1</td>
      <td>1217397</td>
    </tr>
    <tr>
      <th>326</th>
      <td>01-020</td>
      <td>1</td>
      <td>20</td>
      <td>20</td>
      <td>207</td>
      <td>1-0207</td>
      <td>0</td>
      <td>7</td>
      <td>training</td>
      <td>521</td>
      <td>100</td>
      <td>9.411</td>
      <td>1</td>
      <td>1937454</td>
    </tr>
    <tr>
      <th>295</th>
      <td>01-018</td>
      <td>1</td>
      <td>18</td>
      <td>18</td>
      <td>188</td>
      <td>1-0188</td>
      <td>0</td>
      <td>8</td>
      <td>training</td>
      <td>527</td>
      <td>100</td>
      <td>9.468</td>
      <td>1</td>
      <td>1773899</td>
    </tr>
    <tr>
      <th>192</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>121</td>
      <td>1-0121</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>441</td>
      <td>100</td>
      <td>9.469</td>
      <td>1</td>
      <td>1192800</td>
    </tr>
    <tr>
      <th>136</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>89</td>
      <td>1-0089</td>
      <td>0</td>
      <td>9</td>
      <td>training</td>
      <td>487</td>
      <td>100</td>
      <td>9.601</td>
      <td>1</td>
      <td>844460</td>
    </tr>
    <tr>
      <th>281</th>
      <td>01-017</td>
      <td>1</td>
      <td>17</td>
      <td>17</td>
      <td>180</td>
      <td>1-0180</td>
      <td>0</td>
      <td>10</td>
      <td>training</td>
      <td>373</td>
      <td>100</td>
      <td>9.666</td>
      <td>1</td>
      <td>1688546</td>
    </tr>
    <tr>
      <th>128</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>81</td>
      <td>1-0081</td>
      <td>0</td>
      <td>1</td>
      <td>training</td>
      <td>365</td>
      <td>100</td>
      <td>9.735</td>
      <td>1</td>
      <td>795197</td>
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
      <th>191</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>919</td>
      <td>100</td>
      <td>8.338</td>
      <td>1</td>
      <td>1184398</td>
    </tr>
    <tr>
      <th>206</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>130</td>
      <td>1-0130</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>876</td>
      <td>100</td>
      <td>8.349</td>
      <td>1</td>
      <td>1273193</td>
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
      <td>877</td>
      <td>100</td>
      <td>8.473</td>
      <td>1</td>
      <td>114320</td>
    </tr>
    <tr>
      <th>142</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>90</td>
      <td>1-0090</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>834</td>
      <td>100</td>
      <td>8.475</td>
      <td>1</td>
      <td>899267</td>
    </tr>
    <tr>
      <th>30</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>819</td>
      <td>100</td>
      <td>8.675</td>
      <td>1</td>
      <td>206572</td>
    </tr>
    <tr>
      <th>220</th>
      <td>01-013</td>
      <td>1</td>
      <td>13</td>
      <td>13</td>
      <td>140</td>
      <td>1-0140</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>730</td>
      <td>100</td>
      <td>8.720</td>
      <td>1</td>
      <td>1362886</td>
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
      <td>775</td>
      <td>100</td>
      <td>8.733</td>
      <td>1</td>
      <td>215307</td>
    </tr>
    <tr>
      <th>78</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>50</td>
      <td>1-0050</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>787</td>
      <td>100</td>
      <td>8.737</td>
      <td>1</td>
      <td>505169</td>
    </tr>
    <tr>
      <th>79</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>50</td>
      <td>1-0050</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>772</td>
      <td>100</td>
      <td>8.737</td>
      <td>1</td>
      <td>513971</td>
    </tr>
    <tr>
      <th>47</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>30</td>
      <td>1-0030</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>748</td>
      <td>100</td>
      <td>8.796</td>
      <td>1</td>
      <td>313643</td>
    </tr>
    <tr>
      <th>45</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>30</td>
      <td>1-0030</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>762</td>
      <td>100</td>
      <td>8.797</td>
      <td>1</td>
      <td>295640</td>
    </tr>
    <tr>
      <th>202</th>
      <td>01-012</td>
      <td>1</td>
      <td>12</td>
      <td>12</td>
      <td>130</td>
      <td>1-0130</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>729</td>
      <td>100</td>
      <td>8.799</td>
      <td>1</td>
      <td>1246064</td>
    </tr>
    <tr>
      <th>29</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>711</td>
      <td>100</td>
      <td>8.880</td>
      <td>1</td>
      <td>197626</td>
    </tr>
    <tr>
      <th>74</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>50</td>
      <td>1-0050</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>719</td>
      <td>100</td>
      <td>8.911</td>
      <td>1</td>
      <td>470576</td>
    </tr>
    <tr>
      <th>189</th>
      <td>01-011</td>
      <td>1</td>
      <td>11</td>
      <td>11</td>
      <td>120</td>
      <td>1-0120</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>680</td>
      <td>100</td>
      <td>8.942</td>
      <td>1</td>
      <td>1166064</td>
    </tr>
    <tr>
      <th>76</th>
      <td>01-004</td>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>50</td>
      <td>1-0050</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>693</td>
      <td>100</td>
      <td>8.989</td>
      <td>1</td>
      <td>488576</td>
    </tr>
    <tr>
      <th>173</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>110</td>
      <td>1-0110</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>675</td>
      <td>100</td>
      <td>9.012</td>
      <td>1</td>
      <td>1071726</td>
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
      <td>727</td>
      <td>100</td>
      <td>9.018</td>
      <td>1</td>
      <td>277695</td>
    </tr>
    <tr>
      <th>266</th>
      <td>01-016</td>
      <td>1</td>
      <td>16</td>
      <td>16</td>
      <td>170</td>
      <td>1-0170</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>642</td>
      <td>100</td>
      <td>9.052</td>
      <td>1</td>
      <td>1582692</td>
    </tr>
    <tr>
      <th>93</th>
      <td>01-005</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>60</td>
      <td>1-0060</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>625</td>
      <td>100</td>
      <td>9.067</td>
      <td>1</td>
      <td>584640</td>
    </tr>
    <tr>
      <th>46</th>
      <td>01-002</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>30</td>
      <td>1-0030</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>677</td>
      <td>100</td>
      <td>9.070</td>
      <td>1</td>
      <td>304500</td>
    </tr>
    <tr>
      <th>12</th>
      <td>01-000</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>10</td>
      <td>1-0010</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>674</td>
      <td>100</td>
      <td>9.075</td>
      <td>1</td>
      <td>89049</td>
    </tr>
    <tr>
      <th>154</th>
      <td>01-009</td>
      <td>1</td>
      <td>9</td>
      <td>9</td>
      <td>100</td>
      <td>1-0100</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>653</td>
      <td>100</td>
      <td>9.089</td>
      <td>1</td>
      <td>975211</td>
    </tr>
    <tr>
      <th>286</th>
      <td>01-017</td>
      <td>1</td>
      <td>17</td>
      <td>17</td>
      <td>180</td>
      <td>1-0180</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>591</td>
      <td>100</td>
      <td>9.136</td>
      <td>1</td>
      <td>1725969</td>
    </tr>
    <tr>
      <th>303</th>
      <td>01-018</td>
      <td>1</td>
      <td>18</td>
      <td>18</td>
      <td>190</td>
      <td>1-0190</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>599</td>
      <td>100</td>
      <td>9.137</td>
      <td>1</td>
      <td>1818172</td>
    </tr>
    <tr>
      <th>367</th>
      <td>01-022</td>
      <td>1</td>
      <td>22</td>
      <td>22</td>
      <td>230</td>
      <td>1-0230</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>625</td>
      <td>100</td>
      <td>9.141</td>
      <td>1</td>
      <td>2135941</td>
    </tr>
    <tr>
      <th>27</th>
      <td>01-001</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>20</td>
      <td>1-0020</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>641</td>
      <td>100</td>
      <td>9.184</td>
      <td>1</td>
      <td>184547</td>
    </tr>
    <tr>
      <th>174</th>
      <td>01-010</td>
      <td>1</td>
      <td>10</td>
      <td>10</td>
      <td>110</td>
      <td>1-0110</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>625</td>
      <td>100</td>
      <td>9.195</td>
      <td>1</td>
      <td>1080799</td>
    </tr>
    <tr>
      <th>270</th>
      <td>01-016</td>
      <td>1</td>
      <td>16</td>
      <td>16</td>
      <td>170</td>
      <td>1-0170</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>564</td>
      <td>100</td>
      <td>9.197</td>
      <td>1</td>
      <td>1617943</td>
    </tr>
    <tr>
      <th>141</th>
      <td>01-008</td>
      <td>1</td>
      <td>8</td>
      <td>8</td>
      <td>90</td>
      <td>1-0090</td>
      <td>0</td>
      <td>10</td>
      <td>evaluation</td>
      <td>602</td>
      <td>100</td>
      <td>9.200</td>
      <td>1</td>
      <td>890005</td>
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
    

