import pandas as pd
import numpy as np

data = pd.read_excel("python/datasets/languageFinal.xlsx")

df = pd.get_dummies(data, columns=['Skill', 'LearningStyle', 'PlatformCompatibility', 'IndustrtTrends','Ecosystems','Scalibility','DataHandling','Documentation'])

from sklearn.preprocessing import LabelEncoder
label_encoder = LabelEncoder()

# Apply Label Encoding to all columns in the DataFrame
df_encoded = df.apply(label_encoder.fit_transform)

x = df_encoded.iloc[:, df_encoded.columns != 'Language'].values

y = df_encoded.iloc[:,df_encoded.columns == 'Language'].values

from sklearn.multioutput import MultiOutputRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Load or prepare your dataset
# X contains input features
# y contains multivariate output variables

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=1)

# # Create a Multi-Output Decision Trees model
base_model = DecisionTreeRegressor()
model = MultiOutputRegressor(base_model)

# # Train the model on the training data
model.fit(X_train, y_train)

# # Make predictions on the test data


user_input = input()  # This line reads the input sent from Node.js

integer_array = [float(x) for x in user_input.split(",")]


predictionLanguage = model.predict([integer_array])

arrayLanguage = ["Angular.js", "Arduino (C++)", "Assembly language", "Bash", "C", "C#", "C++", "C++", "Dart", "Go", "GDScript", "'HTML', 'CSS', 'JavaScript'", "Java", "JavaScript", "Kotlin", "Kotlin", "MATLAB", "Node.js", "PHP", "PowerShell", "Python", "Python (NumPy, SciPy)", "Python (NumPy, SciPy, Pandas)", "R","React","React Native","React.js","SPSS","Scratch","Shell Scripting","Swift","Swift","TypeScript","Unity (C#)","Vue.js"]
ans = int(predictionLanguage[0][0])
answer = arrayLanguage[ans]
print(answer)
