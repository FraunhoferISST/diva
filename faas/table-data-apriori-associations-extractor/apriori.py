import pandas as pd
from efficient_apriori import apriori
import json
import os

print("👀 Read environment variables")
MIN_CONFIDENCE = os.getenv('MIN_CONFIDENCE', 0.9)
MIN_SUPPORT = os.getenv('MIN_SUPPORT', 0.8)
# required envs
INPUT_FILE = os.environ['INPUT_FILE']
OUTPUT_FILE = os.environ['OUTPUT_FILE']

### Settings ###1
    #Parameter number of pythonscript name
fstParamNum = 1

def aprioriService(inputFile, support, confidence, excludeAttr):
    print("📊 Running analysis...")
    support = float(support)
    confidence = float(confidence)

    df_input = pd.read_csv(inputFile, sep=',', dtype=str)

    # Remove attributes as indicated
    for attr in excludeAttr:
        df_input = df_input.drop(labels=attr, axis=1)

    # Add column information to data
    df_new = pd.DataFrame()
    for column, values in df_input.items():
        newCol = []
        for value in values:
            newCol.append(str(f"{value}|{column}"))

        df_new[column] = pd.Series(newCol)

    # Create itemsets
    rowList = []
    for index, row in df_new.iterrows():
        rowList.append(row.values.flatten().tolist())

    # Perform apriori
    itemsets, rules = apriori(rowList, min_support=support, min_confidence=confidence)

    # Filter unnecessary rules
    filterRules(rules)

    #Generate output
    data = []
    sortedRules = sorted(rules, key=lambda rule: rule.lift, reverse=True)
    # data['ruleCount'] = len(sortedRules)
    for i in range(len(sortedRules)):
        rule = {}
        lhs = {}
        rhs = {}

        # Prepare LHS
        for l in sortedRules[i].lhs:
            pair = l.split("|", 1)
            lhs[pair[1]] = pair[0]

        #Prepare RHS
        for r in sortedRules[i].rhs:
            pair = r.split("|", 1)
            rhs[pair[1]] = pair[0]

        rule['lhs'] = lhs
        rule['rhs'] = rhs
        #rule['representation'] = str(sortedRules[i].__repr__())
        rule['support'] = round(sortedRules[i].support, 5)
        rule['confidence'] = round(sortedRules[i].confidence, 5)
        rule['lift'] = round(sortedRules[i].lift, 3)

        data.append(rule)
    print("🏁 Analysis done!")
    return data

# Filter out rules that are subsets of other rules
def filterRules(rules):
    rules.reverse()
    for rule in rules:
        for rule2 in rules:
            if not rule.__eq__(rule2):
                # Remove circular rule in the scheme a->b b->a
                if rule.support == rule2.support and rule.confidence == rule2.confidence and rule.lhs == rule2.rhs and rule.rhs == rule2.lhs:
                    rules.remove(rule2)
                # Either Subet on the left side
                elif rule.support == rule2.support and rule.confidence == rule2.confidence and rule.rhs == rule2.rhs:
                    if isSubset(list(rule.lhs), list(rule2.lhs)):
                        rules.remove(rule2)
                # Or Subset on the right side
                elif rule.support == rule2.support and rule.confidence == rule2.confidence and rule.lhs == rule2.lhs:
                    if isSubset(list(rule.rhs), list(rule2.rhs)):
                        rules.remove(rule2)

# Determine if a rule set is a subset of other rules
def isSubset(l1, l2):
    equal = True
    for element in l2:
        if element not in l1:
            equal = False

    return equal


data = aprioriService(INPUT_FILE, MIN_SUPPORT, MIN_CONFIDENCE, [])

print("📃 Result: " + json.dumps(data))

print("🖊  Write result...")
f = open(OUTPUT_FILE, "w")
f.write(str(json.dumps(data)))
f.close()

print("🚀 success")
