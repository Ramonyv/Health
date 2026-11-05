export type Organ = { name: string; image: string; symptoms: string[]; fact: string; responses: string[] };
const entries: [string,string,string[],string][] = [
['Brain','Property 1=Brain.png',['Headache','Trouble concentrating','Dizziness'],'The brain coordinates movement, memory, thought, and signals throughout the body.'],
['Heart','Property 1=Heart.png',['A racing heartbeat','Chest discomfort','Feeling fatigued'],'The heart pumps blood through the circulatory system, delivering oxygen and nutrients.'],
['Lungs','Property 1=Lungs.png',['Cough (dry or with phlegm)','Wheezing or chest tightness','Shortness of breath'],'Your lungs exchange oxygen and carbon dioxide through tiny air sacs called alveoli.'],
['Kidney','Property 1=Kidney.png',['Changes in urination','Discomfort in the side','Swelling'],'The kidneys filter blood, balance fluids, and help remove waste through urine.'],
['Intestines','Property 1=Intestines.png',['Bloating','Changes in bowel habits','Abdominal discomfort'],'The intestines absorb nutrients and water and move digestive waste through the body.'],
['Stomach','Stomach.png',['Nausea','Indigestion','Feeling full quickly'],'The stomach mixes food with digestive juices before passing it to the small intestine.'],
['Liver','Lever.png',['Abdominal discomfort','Loss of appetite','Feeling tired'],'The liver processes nutrients, produces bile, and helps break down substances in the blood.'],
['Skin','Property 1=Skin.png',['Dryness','Itching','Redness'],'Skin forms a protective barrier and helps regulate body temperature and sensation.'],
['Spine','Property 1=Spine.png',['Back discomfort','Stiffness','Limited movement'],'The spine supports the body and protects the spinal cord with a column of vertebrae.'],
['Bladder','Property 1=Bladder.png',['Frequent urination','Bladder discomfort','Changes in urgency'],'The bladder is a muscular organ that stores urine until it leaves the body.'],
['Knee','Property 1=Knee.png',['Joint stiffness','Swelling','Discomfort with movement'],'The knee joins the thigh and shin, using cartilage, ligaments, and muscles for movement.'],
['Head','Property 1=Head.png',['Head pressure','Facial discomfort','Tension'],'The head houses the brain and many of the structures involved in sight, hearing, smell, and taste.'],
['Eye','Property 1=Eye.png',['Dry eyes','Eye strain','Irritation'],'The eyes focus light onto the retina, which sends visual signals to the brain.'],
['Ear','Property 1=Ear.png',['Ear discomfort','Ringing','A blocked sensation'],'The ears support both hearing and balance through structures in the outer, middle, and inner ear.'],
['Throat','Property 1=Throat.png',['Soreness','Hoarseness','Discomfort swallowing'],'The throat connects the mouth and nose to the airways and digestive tract.'],
['Tooth','Property 1=Tooth.png',['Sensitivity','Tooth discomfort','Gum irritation'],'Teeth break food into smaller pieces; enamel protects their sensitive inner layers.'],
['Shoulder','Property 1=Shoulder.png',['Shoulder stiffness','Discomfort lifting','Limited movement'],'The shoulder is a mobile ball-and-socket joint supported by muscles and tendons.']
];
export const organs: Organ[] = entries.map(([name,image,symptoms,fact]) => ({name,image:'/assets/'+image,symptoms,fact,responses:symptoms.map(symptom => `${symptom} can have many different explanations. This demonstration cannot determine a cause. ${fact}`)}));
