"""Comprueba integridad y búsquedas de distancia sobre fixtures ficticios."""

import json
import math
from pathlib import Path
import unittest


FIXTURES = Path(__file__).with_name("fixtures-tunja.json")
EARTH_RADIUS_M = 6_371_000


def distance_m(a, b):
    lon1, lat1 = map(math.radians, a)
    lon2, lat2 = map(math.radians, b)
    dlon, dlat = lon2 - lon1, lat2 - lat1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 2 * EARTH_RADIUS_M * math.asin(math.sqrt(h))


class FixtureTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(FIXTURES.read_text(encoding="utf-8"))
        cls.anchors = {row["id"]: row for row in cls.data["search_anchors"]}
        cls.units = {
            unit["id"]: (prop, unit)
            for prop in cls.data["properties"]
            for unit in prop["units"]
        }

    def test_owner_and_unit_ids_are_unique(self):
        self.assertEqual(len(self.units), 4)
        self.assertEqual(len(self.units), len(set(self.units)))
        self.assertTrue(all(prop["owner_id"] in {"adv-a", "adv-b"} for prop, _ in self.units.values()))

    def test_each_property_has_units_and_synthetic_coordinates_in_range(self):
        for prop in self.data["properties"]:
            self.assertTrue(prop["units"])
            lon, lat = prop["coordinates"]
            self.assertTrue(-180 <= lon <= 180 and -90 <= lat <= 90)

    def test_expected_radius_searches(self):
        for case in self.data["radius_cases"]:
            center = self.anchors[case["anchor_id"]]["coordinates"]
            actual = sorted(
                unit_id
                for unit_id, (prop, unit) in self.units.items()
                if unit["available"] and distance_m(center, prop["coordinates"]) <= case["radius_m"]
            )
            expected = sorted(case["expected_units"])
            self.assertEqual(actual, expected, case["id"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
