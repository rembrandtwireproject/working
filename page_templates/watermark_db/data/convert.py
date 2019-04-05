import csv
import io
import itertools
import json

with io.open("Watermark Database - Sheet1.csv") as csvfile:
  fieldnames = [
    "skip",
    "watermark_number",
    "watermark_source",
    "source_image_url",
    "title",
    "inventor",
    "creation_site",
    "date_of_original_work",
    "medium_technique",
    "bartsch_classification",
    "bartsch_state",
    "new_hollstein_classification",
    "new_hollstein_state",
    "other_catalogue_number",
    "subject",
    "owner",
    "credit_line",
    "inventory_number",
    "paper_type",
    "paper_measurements",
    "paper_size_or_format",
    "paper_presumed_origin",
    "paper_mill",
    "paper_maker",
    "watermark_side",
    "watermark_image_creator",
    "watermark_image_date",
    "watermark_image_url",
    "watermark_image_type",
    "watermark_description",
    "watermark_hinterding_classification",
    "watermark_iph_classification",
    "watermark_briquet_description",
    "watermark_briquet_number",
    "watermark_measurements",
    "watermark_location_on_sheet",
    "watermark_twinmark",
    "watermark_equivalent_groups",
    "watermark_proposed_date",
    "watermark_dating_deduction_basis",
    "notes"
  ]
  datafile = csv.DictReader(csvfile, fieldnames=fieldnames)
  for _ in itertools.repeat(None, 5):
    next(datafile)
  for row in datafile:
    if (row["watermark_number"] != "" and row["watermark_number"] != "TBA"):
      with io.open(f"{row['watermark_number']}.json", "w") as wmstream:
        wmstream.write(json.dumps(row))
