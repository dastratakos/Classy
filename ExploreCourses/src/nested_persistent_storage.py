"""
nested_persistent_storage.py
----------------------------
Author: Dean Stratakos
Date: October 5, 2022
"""

import os
import pickle
import time
import xml.etree.ElementTree as ET

from src.explore_courses_course import Course


class NestedPersistentStorage():
    """ This class represents a read/write interface to persistent storage where
    entities/atoms are grouped into files and those files are nested at a
    constant depth of directories.
    """

    def __init__(self, dir: str, depth: int, entity_name: str):
        """ Constructs a new NestedPersistentStorage object.

        Args:
            dir (str): _description_
            depth (int): _description_ TODO: explain depth clearly
            entity_name (str): _description_
        """
        self.__dir = dir
        self.__depth = depth
        self.__entity_name = entity_name

        if not os.path.exists(f"{dir}"):
            os.mkdir(f"{dir}")

    def __collect_all_entities(self, verbose: bool = False):
        """ Iterates through SELF.__DIR and builds a combined dictionary of the
        entities contained within the files.

        TODO: replace recursion with closure (huge speed ups):
        https://towardsdatascience.com/dont-use-recursion-in-python-any-more-918aad95094c

        Args:
            verbose (bool, optional):  Specifies if times should be printed out.
                                       Defaults to False.

        Returns:
            dict:  The collected entities.
        """

        def __wrapper():
            """ This function is needed to create the "function variable"
            ALL_ENTITIES. Function variables cannot be created on Class
            functions (e.g. self.__collect_all_entities).

            Returns:
                dict:  The collected entities.
            """
            __wrapper.all_entities = {}

            def __recurse(curr_path: str,
                          curr_depth: int,
                          verbose: bool = False):
                """ Recurses down CURR_PATH and collects all entities, storing
                them in __wrapper.all_entities.

                Args:
                    curr_path (str):           The current path being searched.
                    curr_depth (int):          The current depth of the
                                               recursion.
                    all_entities (dict):       Contains all of the entities from
                                               previous recursive calls. After
                                               the function returns, it will
                                               also contain all of the entities
                                               that are children of CURR_PATH.
                    verbose (bool, optional):  Specifies if times should be
                                               printed out. Defaults to False.
                """
                # Base case
                if curr_depth == self.__depth + 1:
                    if not os.path.isfile(curr_path):
                        print(f"[ERROR]: curr_path {curr_path} is not a file.")
                        return

                    with open(curr_path) as f:
                        # TODO: abstract XML specific code
                        root = ET.fromstring(f.read())
                        entities = root.findall(f".//{self.__entity_name}")

                        # TODO: abstract Course specific code
                        for entity in entities:
                            e = Course(entity)
                            if e.courseId in __wrapper.all_entities:
                                __wrapper.all_entities[e.courseId] += e
                            else:
                                __wrapper.all_entities[e.courseId] = e

                    return

                if os.path.isfile(curr_path):
                    return

                # Recursive case
                start = time.time()

                subdirs = sorted(os.listdir(curr_path))
                for subdir in subdirs:
                    __recurse(os.path.join(curr_path, subdir),
                              curr_depth + 1,
                              verbose=verbose)

                end = time.time()
                if verbose:
                    curr_dir = curr_path.split("/")[-1]
                    print('  ' * curr_depth, end='')
                    print(f"({end - start:.2f} s) {curr_dir}: {len(subdirs)}")

            __recurse(self.__dir, 0, verbose=verbose)
            return __wrapper.all_entities

        return __wrapper()

    def generate_pkl(self, pkl_filename: str, reset: bool = False):
        """ Iterates through the nested storage and generate a .pkl file.

        TODO: Provide ways to get data from a specific directory.
        TODO: Use the RESET parameter.

        Args:
            pkl_filename (str):      The name of the file to create.
            reset (bool, optional):  If False, look for a .pkl file at
                                     PKL_FILENAME to load and skip over
                                     directories already included in this
                                     version.
                                     If True, do not look at old version and
                                     generate .pkl file from scratch.
                                     Defaults to False.
        """
        all_entities = self.__collect_all_entities(path=self.__dir,
                                                   verbose=True)

        with open(pkl_filename, "wb") as f:
            pickle.dump(all_entities, f)

    def load(self, pkl_filename: str):
        """ Loads persisted data from a .pkl file.

        Args:
            pkl_filename (str):  The name of the file to load.
        """
        if not os.path.exists(pkl_filename):
            print(f"[ERROR]: Could not find .pkl file {pkl_filename}")
            return

        with open(pkl_filename, "rb") as f:
            return pickle.load(f)

    def write(self, data, filename, *path):
        """ Writes DATA to the specified FILENAME. Creates the nested
        directories if they do not exist.

        Args:
            data (bytes):       The data to write to the file
            filename (_type_):  The name of the file to write to.
            *path (*str):       The path of the file. len(path) must be equal to
                                self.__depth.
        """
        if len(path) != self.__depth:
            actual = f"*path {path} has length {len(path)}"
            expected = f"Expected {self.__depth}"
            print(f"[ERROR]: {actual}. {expected}.")

        current_path = self.__dir
        for dir in path:
            current_path = f"{current_path}/{dir}"
            if not os.path.exists(current_path):
                os.mkdir(current_path)

        current_path = f"{current_path}/{filename}"
        if not os.path.exists(current_path):
            with open(current_path, "xb") as f:
                f.write(data)
