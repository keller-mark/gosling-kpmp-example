/* eslint-disable */
import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { GoslingComponent } from 'gosling.js';
import { ChromosomeInfo } from 'higlass';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';

const REFERENCE_TILESETS = {
  hg38: {
    chromosomes: 'NyITQvZsS_mOFNlz5C2LJg',
    genes: 'P0PLbQMwTYGy-5uPIQid7A',
  },
  hg19: {
    chromosomes: 'N12wVGG9SPiTkk03yUayUw',
    genes: 'OHJakQICQD6gTD7skx4EWA',
  },
  mm9: {
    chromosomes: 'WAVhNHYxQVueq6KulwgWiQ',
    genes: 'GUm5aBiLRCyz2PsBea7Yzg',
  },
  mm10: {
    chromosomes: 'EtrWT0VtScixmsmwFSd7zg',
    genes: 'QDutvmyiSrec5nX4pA5WGQ',
  },
};

const CHRS = [
	'chr1',
	'chr2',
	'chr3',
	'chr4',
	'chr5',
	'chr6',
	'chr7',
	'chr8',
	'chr9',
	'chr10',
	'chr11',
	'chr12',
	'chr13',
	'chr14',
	'chr15',
	'chr16',
	'chr17',
	'chr18',
	'chr19',
	'chr20',
	'chr21',
	'chr22',
	'chrX',
	'chrY',
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 200,
		maxWidth: 300,
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: 2,
	},
}));

const names = [
  'Neuron',
	'B Cell',
	'T Cell'
];

const cellTypeToBigWigUrl = {
	'Neuron': "https://s3.amazonaws.com/gosling-lang.org/data/ExcitatoryNeurons-insertions_bin100_RIPnorm.bw",
	'B Cell': "https://s3.amazonaws.com/gosling-lang.org/data/ExcitatoryNeurons-insertions_bin100_RIPnorm.bw",
	'T Cell': "https://s3.amazonaws.com/gosling-lang.org/data/ExcitatoryNeurons-insertions_bin100_RIPnorm.bw",
};



const TRACK_WIDTH = 1000;
const TRACK_HEIGHT = 40;


const initialSpec = { 
	style: { "outline": "#20102F" },
	spacing: 0,
	xDomain: { "chromosome": "chr1" },
	tracks: [
		{
			id: 'navigation-track-id',
			template: 'gene',
			data: {
				url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation',
				type: 'beddb',
				genomicFields: [
					{index: 1, name: 'start'},
					{index: 2, name: 'end'}
				],
				valueFields: [
					{index: 5, name: 'strand', type: 'nominal'},
					{index: 3, name: 'name', type: 'nominal'}
				],
				exonIntervalFields: [
					{index: 12, name: 'start'},
					{index: 13, name: 'end'}
				]
			},
			encoding: {
				startPosition: {field: 'start', axis: 'none'},
				endPosition: {field: 'end'},
				strandColor: {field: 'strand', range: ['gray']},
				strandRow: {field: 'strand'},
				opacity: {value: 0.4},
				geneHeight: {value: 15},
				geneLabel: {field: 'name'},
				geneLabelFontSize: {value: 30},
				geneLabelColor: {field: 'strand', range: ['gray']},
				geneLabelStroke: {value: 'white'},
				geneLabelStrokeThickness: {value: 4},
				geneLabelOpacity: {value: 1},
				type: {field: 'type'}
			},
			width: TRACK_WIDTH,
			height: TRACK_HEIGHT
		},
		{
			alignment: 'overlay',
			data: {
				url: 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/cytogenetic_band.csv',
				type: 'csv',
				chromosomeField: 'Chr.',
				genomicFields: [
					'ISCN_start',
					'ISCN_stop',
					'Basepair_start',
					'Basepair_stop'
				]
			},
			tracks: [
				{
					mark: 'text',
					dataTransform: [
						{
							type: 'filter',
							field: 'Stain',
							oneOf: ['acen-1', 'acen-2'],
							not: true
						}
					],
					text: {field: 'Band', type: 'nominal'},
					color: {value: 'black'},
					strokeWidth: {value: 0},
					visibility: [
						{
							operation: 'less-than',
							measure: 'width',
							threshold: '|xe-x|',
							transitionPadding: 10,
							target: 'mark'
						}
					]
				},
				{
					mark: 'rect',
					dataTransform: [
						{
							type: 'filter',
							field: 'Stain',
							oneOf: ['acen-1', 'acen-2'],
							not: true
						}
					],
					color: {
						field: 'Density',
						type: 'nominal',
						domain: ['', '25', '50', '75', '100'],
						range: ['white', '#D9D9D9', '#979797', '#636363', 'black']
					}
				},
				{
					mark: 'rect',
					dataTransform: [
						{type: 'filter', field: 'Stain', oneOf: ['gvar']}
					],
					color: {value: '#A0A0F2'}
				},
				{
					mark: 'triangleRight',
					dataTransform: [
						{type: 'filter', field: 'Stain', oneOf: ['acen-1']}
					],
					color: {value: '#B40101'}
				},
				{
					mark: 'triangleLeft',
					dataTransform: [
						{type: 'filter', field: 'Stain', oneOf: ['acen-2']}
					],
					color: {value: '#B40101'}
				}
			],
			x: {field: 'Basepair_start', type: 'genomic', axis: 'bottom'},
			xe: {field: 'Basepair_stop', type: 'genomic'},
			stroke: {value: 'gray'},
			strokeWidth: {value: 1},
			width: TRACK_WIDTH,
			height: 20
		},
	],
};


function WidgetNavigation(props) {
	const {
		assembly = 'hg38',
	} = props;

	const gosRef = useRef();

	const classes = useStyles();

  const [selectedCellTypes, setSelectedCellTypes] = useState([]);
	// For gene autocomplete
	const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
	const [initialXDomainAbsToChr, setInitialXDomainAbsToChr] = useState(null);
	const [spec, setSpec] = useState(initialSpec);

  const handleChange = (event) => {
    setSelectedCellTypes(event.target.value);
  };

	const cellTypeTracks = useMemo(() => {
		return selectedCellTypes.map(cellType => ({
			data: {
				"url": cellTypeToBigWigUrl[cellType],
				"type": "bigwig",
				"column": "position",
				"value": "peak"
			},
			mark: 'bar',
			x: {field: 'position', type: 'genomic'},
			y: {field: 'peak', type: 'quantitative', axis: 'none'},
			color: { value: "#3DC491"},
			title: cellType,
			width: TRACK_WIDTH,
			height: TRACK_HEIGHT
		}));
	}, [selectedCellTypes]);

	// Need to use an effect to set the updated spec, even though useMemo would be nicer.
	useEffect(() => {
		setSpec({
			...initialSpec,
			xDomain: (initialXDomainAbsToChr ? initialXDomainAbsToChr : initialSpec.xDomain),
			tracks: [
				...initialSpec.tracks,
				...cellTypeTracks,
			]
		});
	}, [cellTypeTracks]);

	const zoomToChromosome = useCallback((e) => {
		gosRef.current?.api.zoomTo('navigation-track-id', e.target.value, 0, 1000);
	}, [gosRef]);

	const zoomToGene = useCallback((event, newValue) => {
		gosRef.current?.api.zoomToGene('navigation-track-id', newValue, 3000, 1000);
	}, [gosRef]);

	useEffect(() => {
		let active = true;

		if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

		new Promise((resolve, reject) => {
			gosRef.current.api.suggestGene('navigation-track-id', inputValue, (suggestions) => {
				resolve(suggestions);
			});
		}).then(apiData => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (apiData) {
          newOptions = [...newOptions, ...apiData.map(({ geneName}) => geneName)];
        }

        setOptions(newOptions);
      }
    });
		return () => {
      active = false;
    };
	}, [value, inputValue]);

	// Listen for higlass view config changes.
	useEffect(() => {
		gosRef.current.hgApi.api.on("viewConfig", (newViewConfigString) => {
			const newViewConfig = JSON.parse(newViewConfigString);

			// Find the view associated with this viewId.
			const foundViewIndex = newViewConfig.views.findIndex(v => v.uid === 'navigation-track-id');
			const foundView = newViewConfig.views[foundViewIndex];
			const { initialXDomain } = foundView;

			const chromInfo = new Promise((resolve, reject) => {
				ChromosomeInfo(
					`https://higlass.io/api/v1/chrom-sizes/?id=${REFERENCE_TILESETS[assembly].chromosomes}`,
					(chromInfo) => { resolve(chromInfo) }
				);
			});

			chromInfo.then(d => {
				const start = d.absToChr(initialXDomain[0]);
				const end = d.absToChr(initialXDomain[1]);
				const nextDomain = { "chromosome": start[0], interval: [start[1], Math.ceil(start[1] + (initialXDomain[1] - initialXDomain[0]))] };
				console.log(nextDomain)
				setInitialXDomainAbsToChr(nextDomain);
			})
		});

		return () => {
			gosRef.current.hgApi.api.off("viewConfig");
		};
	}, [gosRef, spec]);

	return (
		<>
			<Grid
				container
				direction="row"
				justifyContent="start"
			>
				<Grid item xs={2}>
					<FormControl className={classes.formControl}>
						<InputLabel id="demo-simple-select-label">Zoom to Chromosome</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							onChange={zoomToChromosome}
						>
							{CHRS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>

				<Grid item xs={2}>
					<FormControl className={classes.formControl}>
						<Autocomplete
							style={{ width: 300 }}
							getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
							filterOptions={(x) => x}
							options={options}
							autoComplete
							includeInputInList
							filterSelectedOptions
							value={value}
							onChange={zoomToGene}
							onInputChange={(event, newInputValue) => {
								setInputValue(newInputValue);
							}}
							renderInput={(params) => (
								<TextField {...params} label="Zoom to Gene" fullWidth />
							)}
							renderOption={(option) => {
								return (
									<Grid container alignItems="center">
										<Grid item xs>
											<Typography variant="body2" color="textSecondary">
												{option}
											</Typography>
										</Grid>
									</Grid>
								);
							}}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={2}>
					<FormControl className={classes.formControl}>
						<Button variant="contained" onClick={() => gosRef.current?.api.zoomToExtent('navigation-track-id', 1000)}>Zoom to Extent</Button>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl className={classes.formControl}>
						<InputLabel id="demo-mutiple-chip-label">Cell Types</InputLabel>
						<Select
							labelId="demo-mutiple-chip-label"
							id="demo-mutiple-chip"
							multiple
							value={selectedCellTypes}
							onChange={handleChange}
							input={<Input id="select-multiple-chip" />}
							renderValue={(selected) => (
								<div className={classes.chips}>
									{selected.map((value) => (
										<Chip key={value} label={value} className={classes.chip} />
									))}
								</div>
							)}
							MenuProps={MenuProps}
						>
							{names.map((name) => (
								<MenuItem key={name} value={name} style={{ fontWeight: 'normal' }}>
									{name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>

			<GoslingComponent
				ref={gosRef}
				spec={spec}
				experimental={{ reactive: true }}
			/>
		</>
	);
}

export default WidgetNavigation;
