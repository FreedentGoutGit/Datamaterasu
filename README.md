# Project of Data Visualization (COM-480)
[Website link](https://freedentgoutgit.github.io/Datamaterasu/)

|  Student's name  | SCIPER |
| ---------------- | ------ |
| Pablo Palle      | 297781 |
| Victor Pennacino | 310608 |
| Hod Kimhi        | 385031 |

The full milestone 1 report can be found [here](https://github.com/FreedentGoutGit/Datamaterasu/blob/master/milestones/milestone-1/milestone-1.md), with exploratory data analysis available [here](https://github.com/FreedentGoutGit/Datamaterasu/blob/master/milestones/milestone-1/pre_analysis.ipynb)

The full milestone 2 report can be found [here](https://github.com/FreedentGoutGit/Datamaterasu/blob/master/milestones/milestone-2/milestone-2.md), with commit [88dd33d](https://github.com/FreedentGoutGit/Datamaterasu/tree/88dd33d499e61ad31f065c5988323332d10469e1) representing the initial website prototype and structure

The process book and screencast for milestone 3 can be found [here](https://github.com/FreedentGoutGit/Datamaterasu/tree/master/milestones/milestone-3)

## Table of Contents:
- [Project structure](#repo-project-structure)
- [Milestone 1](#milestone-2-26th-april-5pm)
- [Milestone 2](#milestone-2-26th-april-5pm)
- [Milestone 3](#milestone-3-31st-may-5pm)

## Repo / Project structure

The project is structured as follows:
```
root
├─ data/        # collection of interesting and possibly useful datasets, unprocessed
├─ docs/        # website entry point
├─ milestones/  # milestone reports and associated data
├─ src/         # contains scripts for pre-processing and filtering data
└─ README.md    # this file
```

The website is run out of the `docs/` directory, with subdirectories organized as follows:
```
docs
├─ css/         # all css files
├─ data/        # filtered/cleaned datasets for the website
├─ html/        # html template files
├─ images/      # any images that need to be loaded
├─ js/          # all javascript scripts
├─ index.html   # website entry point
└─ README.md    # this file
```

To run the website locally, one simply needs to run a local server (such as through [live-server](https://tapiov.net/live-server/) or running `python -m http.server`) in the `docs/` directory. There are no installable dependencies, we use simple HTML, CSS, and JavaScript and load D3.js and other modules through the use of CDNs and `<script>` tags.

The GitHub pages website points to the `master` branch, so any updates to this branch will deploy and publish directly to [https://freedentgoutgit.github.io/Datamaterasu/](https://freedentgoutgit.github.io/Datamaterasu/)


## Milestone 1 (29th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).

The following are some datasets that we plan to explore:

* [ourworldindata.org - CO2 and GHG Emissions](https://ourworldindata.org/co2-and-greenhouse-gas-emissions#explore-data-on-co2-and-greenhouse-gas-emissions) ([direct link](https://github.com/owid/co2-data)) (Carbon dioxide and GHG emissions from fossil fuels and industry, by country)
* [Carbon Footprints of World Cities](https://www.citycarbonfootprints.info/) ([direct link - absolute emissions](https://www.citycarbonfootprints.info/GGMCF_top500cities.txt), [direct link - per capita](https://www.citycarbonfootprints.info/GGMCF_top500citiesPercap.txt)) (model of carbon footprint estimates of individual cities across 189 countries)
* [CCUS Projects Database](https://www.iea.org/) ([direct link](https://www.iea.org/data-and-statistics/data-product/ccus-projects-database#)) (list of existing Carbon Capture Usage & Storage (CCUS) initiatives in place worldwide since the 1970s)
* [AR6 IPCC report databrowser-Temperature projections](https://ipcc-data.org/ar6landing.html)([direct link](https://ipcc-browser.ipcc-data.org/browser/dataset/6397/0)) (datasets for the projection of different variables depending on various plausible emission rates)

Some additional, reduced-scope datasets we may explore and use in the project:
* [USA EIA - CO2 Emissions from Electricity Generation](https://www.eia.gov/electricity/data.php#elecenv) (Carbon dioxide emissions as a result of electricity generation in the USA)
* [Toronto, Canada - GHG Emissions by Sector](https://www.toronto.ca/services-payments/water-environment/environmentally-friendly-city-initiatives/transformto/sector-based-emissions-inventory/) (GHG emissions by industry sector in the city of Toronto)
* [New York, USA - Statewide GHG Emissions](https://data.ny.gov/Energy-Environment/Statewide-Greenhouse-Gas-Emissions-Beginning-1990/5i6e-asw6/about_data) (GHG emissions for the state of New York)
* [IGES NDC Database](https://www.iges.or.jp/en/pub/iges-indc-ndc-database/en) ([direct link](https://www.iges.or.jp/en/publication_documents/pub/data/en/5005/IGES+NDC+Database_v7.7.xlsx)) (Summary of main climate pledges and NDCs of signatories of the Paris Agreement)

These datasets are provided in simple formats (generally csv or xlsx) that make the data easy to import and use directly without much cleaning.

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

The 2015 Paris Agreement marked a global commitment to limit the rise in global temperatures to well below 2°C. Despite this ambition, the United Nations Framework Convention on Climate Change (UNFCCC) highlights that current efforts [fall short of the necessary actions to achieve net-zero targets](https://www.politico.eu/article/paris-agreement-goals-failed-climate-change-global-warming-united-nations-climate-review/).

Data visualization is recognized as a key strategy to guide climate action effectively. The IPCC emphasizes the value of using regular scientific assessments to inform policymakers about climate change, its consequences, and strategies for adaptation and mitigation. However, the existing visual aids, such as those in IPCC reports, can be complex and lengthy, making them challenging for a broader audience to engage with.

Interactive graphs offer a solution by providing a clear, global perspective on crucial areas needing improvement, from reducing CO2 emissions to advancing Carbon Capture, Utilization, and Storage (CCUS) technologies. Visual representations on world maps that detail GHG emissions, temperature forecasts, and CCUS projects can play a vital role in the climate battle, helping to make the challenges and solutions more understandable to everyone.

Our goal is to bridge the gap between projected climate scenarios and practical actions, showcasing where and how efforts can be most effectively applied.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

See [pre_analysis.ipynb](https://github.com/FreedentGoutGit/Datamaterasu/blob/master/milestones/milestone-1/pre_analysis.ipynb)

### Related work

> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

[IPCC 6th report](https://www.ipcc.ch/assessment-report/ar6/)
* The most comprehensive effort so far by the scientific community to understand the consequences of human created climate change and potential solutions. Lot's of interesting visualizations, but super lengthy and a pain to read.

[IPCC interactive Atlas](https://interactive-atlas.ipcc.ch/)
* An interactive atlas for visualization of emissions and temperature projections. Does not include any potential solutions, or more local visualizations (city level ect.)

[CCUS Map](https://ccusmap.com/)
* Visualization of active CCUS ventures. Main features blocked behind a paywall. Not very nice looking. No projections

[Our world in data](https://ourworldindata.org/co2-emissions)
* Our world in data has a lot of detailed analysis of GHG and CO2 emission metrics, with interesting interactive graphs. Very specific topics are covered each time, links are harder to find.


## Milestone 2 (26th April, 5pm)

**10% of the final grade**

> _Two A4 pages describing the project goal_
>
> - Include sketches of the vizualiation you want to make in your final product.
>
> - List the tools that you will use for each visualization and which (past or future) lectures you will need.
>
> - Break down your goal into independent pieces to implement. Try to design a core visualization (minimal viable product) that will be required at the end. Then list extra ideas (more creative or challenging) that will enhance the visualization but could be dropped without endangering the meaning of the project.
>
> _Functional project prototype review._
>
> - You should have an initial website running with the basic skeleton of the visualization/widgets.

The full milestone 2 report can be found [here](https://github.com/FreedentGoutGit/Datamaterasu/blob/master/milestones/milestone-2/milestone-2.md), with commit [88dd33d](https://github.com/FreedentGoutGit/Datamaterasu/tree/88dd33d499e61ad31f065c5988323332d10469e1) representing the initial website prototype and structure


## Milestone 3 (31st May, 5pm)

**80% of the final grade**

> For the final milestone, you need to create a cool, interactive, and sufficiently complex D3.js (and other) data viz on the dataset you chose. Tell a data story and explain it to the targeted audience. Create a process book that details how you got there, from the original idea to the final product.
>
> You need to deliver the following things:
>
> 1. **Github repository** with a README
>     - Host the code and data on Github (if data is too big, link to a cloud storage) with your process book as a PDF file
>     - Add a README file that explains the technical setup and intended usage
>     - Code should be clean, manageable, and using the latest practices
>
> 2. **Screencast**
>     - Demonstrate what you can do with your viz in a fun, engaging and impactful manner
>     - Talk about your main contributions rather than on technical details
>     - 2 min video (not more)
>
> 3. **Process book** (max 8 pages)
>     - Describe the path you took to obtain the final result
>     - Explain challenges that you faced and design decisions that you took
>     - Reuse the sketches/plans that you made for the first milestone, expanding them and explaining the changes
>     - Care about the visual/design of this report
>     - Peer assessment: include a breakdown of the parts of the project completed by each team member.
>
> The grading is the following:
> - Visualization (35%)
> - Technical Implementation (15%)
> - Screencast (25%)
> - Process book (25%)
>
> Grades may vary across the team members, based on the process book and the
> peer assessment process. Please provide clear explanations

The process book and screencast can be found in the [milestone-3 folder](https://github.com/FreedentGoutGit/Datamaterasu/tree/master/milestones/milestone-3)


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone
