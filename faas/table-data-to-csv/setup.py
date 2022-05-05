import setuptools

setuptools.setup(
    name="table-data-to-csv",
    version="1.0.0",
    serviceId="service:uuid:19232684-53f1-4235-8656-0731ee63bcf0",
    author="Fraunhofer ISST",
    description="Converts .sas7bdat to .csv",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        'Topic :: Text Processing',
        'Topic :: FaaS',
    ],
    python_requires='>=3.8',
)
