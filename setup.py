"""
Setup script for the screenshot SaaS application.
"""
from setuptools import setup, find_packages


with open("requirements.txt") as f:
    requirements = f.read().splitlines()


setup(
    name="screenshot-saas",
    version="0.1.0",
    description="A SaaS application for extracting screenshots from app stores",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="Your Name",
    author_email="your.email@example.com",
    url="https://github.com/yourusername/screenshot-saas",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=requirements,
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.11",
    entry_points={
        "console_scripts": [
            "screenshot-saas=screenshot_saas.cli:main",
        ],
    },
)